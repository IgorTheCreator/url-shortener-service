import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { LongUrlDto, RedirectParamDto } from './dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Put('/url')
  getShortnenUrl(@Body() body: LongUrlDto) {
    return this.urlService.createShortUrl(body);
  }

  @Get('/:shortUrl')
  async redirectToLongUrl(@Param() params: RedirectParamDto, @Res() res) {
    const { long } = await this.urlService.getLongUrl(params);
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(long);
  }
}
