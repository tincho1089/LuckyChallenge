import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @MinLength(4)
  @MaxLength(8)
  @IsNotEmpty()
  password: string;
}
