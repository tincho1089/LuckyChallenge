import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import {
  closeTransaction,
  openConnection,
  runTransQuery,
} from '../globals/bdconfig';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private jwtAuthService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async register(userObject: RegisterAuthDto) {
    try {
      const userInDB = await this.userRepository.findByName(
        userObject.username,
      );
      if (userInDB.length > 0) {
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }

      const { password } = userObject;
      const plainToHash = await hash(password!, 10);
      userObject = { ...userObject, password: plainToHash };

      const { transaction } = await openConnection();
      await transaction.begin().catch(() => {
        throw new HttpException('TRANSACTION_OPEN_ERROR', 403);
      });

      let rsp = await runTransQuery(
        ' INSERT INTO [dbo].[users](USERNAME,PASSWORD) OUTPUT INSERTED.ID VALUES (@USERNAME,@PASSWORD) ',
        transaction,
        [
          { key: 'username', type: 'string', value: userObject.username },
          { key: 'password', type: 'string', value: userObject.password },
        ],
      );
      const userId = rsp.recordset[0].ID;

      rsp = await runTransQuery(
        ' INSERT INTO ADDRESS(CITYID, STREET) OUTPUT INSERTED.ID VALUES(@CITYID, @ADDRESS) ',
        transaction,
        [
          { key: 'cityid', type: 'int', value: userObject.cityId },
          { key: 'address', type: 'string', value: userObject.address },
        ],
      );
      const addressId = rsp.recordset[0].ID;

      rsp = await runTransQuery(
        ' INSERT INTO PROFILES(USERID, ADDRESSID, NAME) VALUES(@USERID, @ADDRESSID, @NAME) ',
        transaction,
        [
          { key: 'userid', type: 'int', value: userId },
          { key: 'addressid', type: 'int', value: addressId },
          { key: 'name', type: 'string', value: userObject.name },
        ],
      );
      if (rsp.err) throw new HttpException('ERROR_USER_CREATION', 500);
      this.logger.log('User created successfully');
      rsp = await closeTransaction(transaction, rsp.err);
      return rsp;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async login(userObjectLogin: LoginAuthDto) {
    try {
      const { username, password } = userObjectLogin;
      const { transaction } = await openConnection(false);
      const user = await runTransQuery(
        'SELECT U.id, U.username, U.password FROM USERS U WHERE U.USERNAME = @username',
        transaction,
        [{ key: 'username', type: 'string', value: username }],
      );

      if (!user.recordset[0])
        throw new HttpException('USERNAME_INCORRECT', 403);

      const isMatch = await compare(password, user.recordset[0].password);
      if (!isMatch) throw new HttpException('PASSWORD_INCORRECT', 403);

      const payload = {
        username: user.recordset[0].username,
        sub: user.recordset[0].id,
      };

      const token = this.jwtAuthService.sign(payload);
      this.logger.log('User Logged in successfully');
      return { jwtToken: token };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
