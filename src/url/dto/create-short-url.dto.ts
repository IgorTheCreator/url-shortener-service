import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUrl } from 'class-validator';

export class LongUrlDto {
  @ApiProperty({
    description: 'url',
    required: true,
  })
  @IsUrl()
  long: string;

  @ApiProperty({
    description: 'дата истекания',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expires?: string;
}
