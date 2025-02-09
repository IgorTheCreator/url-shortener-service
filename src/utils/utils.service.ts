import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  sha256(content: string) {
    return createHash('sha256').update(content).digest('hex');
  }
}
