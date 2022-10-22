import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger();

  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll() {
    try {
      const all = await this.userService.findAll();
      return all;
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Get('profile')
  async findById(@Request() req: any) {
    try {
      const user = await this.userService.findById(req);
      return user;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
