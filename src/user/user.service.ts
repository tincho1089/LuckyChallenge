import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(
    private userRepository: UserRepository,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async findAll() {
    try {
      const all = await this.userRepository.findAll();
      return all;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async findById(req: any) {
    try {
      const cachedProfile = await this.cacheManager.get(
        'user+' + req.user.userId,
      );
      if (cachedProfile) return cachedProfile;

      const response = await this.userRepository.findById(req.user.userId);

      this.cacheManager.set(
        'user+' + req.user.userId,
        response,
        this.configService.get('REDIS_TTL'),
      );

      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
