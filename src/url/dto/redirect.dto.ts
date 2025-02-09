import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RedirectParamDto {
  @ApiProperty({
    description: 'хэш',
    required: true,
  })
  @IsString()
  shortUrl: string;
}
