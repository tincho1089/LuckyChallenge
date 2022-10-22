import { HttpException, Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { openConnection, runTransQuery } from '../globals/bdconfig';

@Injectable()
export class UserRepository implements BaseRepository<any> {
  private readonly logger = new Logger();

  async findAll() {
    try {
      await openConnection(false);
      let users = await runTransQuery(
        'SELECT U.id, U.password, P.name, A.street, C.name as city, CO.name as country ' +
          'FROM USERS U ' +
          'LEFT OUTER JOIN PROFILES P ON P.userId = U.id ' +
          'LEFT OUTER JOIN ADDRESS A ON A.id = P.addressId ' +
          'LEFT OUTER JOIN CITY C ON C.id = A.cityId ' +
          'LEFT OUTER JOIN COUNTRY CO ON CO.id = C.countryId ',
        null,
        [],
      );
      users = users.recordset.map((element: any) => {
        return this.castUserObject(element);
      });
      this.logger.log('User list fetched successfully');
      return users;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async findById(
    userId: number,
  ): Promise<{ userId: number; username: string }> {
    try {
      const { transaction } = await openConnection(false);
      let user = await runTransQuery(
        'SELECT U.id, U.password, P.name, A.street, C.name as city, CO.name as country ' +
          'FROM USERS U ' +
          'LEFT OUTER JOIN PROFILES P ON P.userId = U.id ' +
          'LEFT OUTER JOIN ADDRESS A ON A.id = P.addressId ' +
          'LEFT OUTER JOIN CITY C ON C.id = A.cityId ' +
          'LEFT OUTER JOIN COUNTRY CO ON CO.id = C.countryId ' +
          'WHERE U.id = @id',
        transaction,
        [{ key: 'id', type: 'int', value: userId }],
      );

      if (!user) throw new HttpException('ERROR_IN_DB_ACCESS', 403);
      if (!user.recordset[0]) throw new HttpException('ID_INCORRECT', 403);

      user = this.castUserObject(user.recordset[0]);
      this.logger.log('User info fetched successfully');
      return user;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async findByName(username: string) {
    try {
      const { transaction } = await openConnection(false);
      let user = await runTransQuery(
        'SELECT U.id, U.password, P.name, A.street, C.name as city, CO.name as country ' +
          'FROM USERS U ' +
          'LEFT OUTER JOIN PROFILES P ON P.userId = U.id ' +
          'LEFT OUTER JOIN ADDRESS A ON A.id = P.addressId ' +
          'LEFT OUTER JOIN CITY C ON C.id = A.cityId ' +
          'LEFT OUTER JOIN COUNTRY CO ON CO.id = C.countryId ' +
          'WHERE U.username = @username',
        transaction,
        [{ key: 'username', type: 'string', value: username }],
      );

      if (!user) throw new HttpException('ERROR_IN_DB_ACCESS', 403);

      user = user.recordset;
      this.logger.log('Validation of username in creation successfully');
      return user;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  castUserObject(user: any) {
    return {
      id: user.id,
      name: user.name,
      address: {
        street: user.street,
        city: user.city,
        country: user.country,
      },
    };
  }
}
