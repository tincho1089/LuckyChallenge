import { Injectable, Logger } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private authRepository: AuthRepository
  ) {}

  async register(userObject: RegisterAuthDto) {
    try {
      const response = await this.authRepository.register(userObject);
      return response;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async login(userObjectLogin: LoginAuthDto) {
    try {
      const response = await this.authRepository.login(userObjectLogin);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
