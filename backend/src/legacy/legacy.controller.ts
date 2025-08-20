import { Controller, All, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller('api/old')
export class LegacyController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const legacyUrl = this.configService.get<string>('LEGACY_BACKEND_URL');
    const url = legacyUrl + req.originalUrl;
    const method = req.method.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = req.body;
    const headers = req.headers;

    try {
      const response = await lastValueFrom(
        this.httpService.request({
          url,
          method,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data,
          headers,
          responseType: 'stream',
        }),
      );

      if (response && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        response.data.pipe(res);
      } else {
        res.status(502).json({ error: 'Legacy backend unavailable' });
      }
    } catch {
      res.status(502).json({ error: 'Legacy backend unavailable' });
    }
  }
}
