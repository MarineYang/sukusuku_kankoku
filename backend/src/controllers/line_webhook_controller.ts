import { Request, Response } from 'express';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { OpenAPI } from 'routing-controllers-openapi';
import { Body, HttpCode } from 'routing-controllers';
import { Service } from 'typedi';
import { LineService } from '../services/line_services';
import { env } from '../env';
import { middleware, WebhookEvent } from '@line/bot-sdk';

@Service()
@Controller('webhook/line')
export class LineWebhookController {
  constructor(
    private lineService: LineService,

  ) { }
  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    // Line SDK 미들웨어를 통한 서명 검증
    const lineConfig = {
      channelAccessToken: env.line.channelAccessToken,
      channelSecret: env.line.channelSecret
    };

    // 미들웨어 적용 (서명 검증)
    middleware(lineConfig)(req, res, async () => {
      try {
        const events: WebhookEvent[] = req.body.events;
        
        for (const event of events) {
          // 사용자 ID 추출
          const userId = event.source.userId;
          
          if (!userId) continue;
          
          // 이벤트 유형에 따라 처리
          await this.lineService.addLineChanelFromUser(userId, event);
        }
        
        // Line 서버에 200 응답
        res.status(200).end();
      } catch (error) {
        console.error('웹훅 처리 오류:', error);
        res.status(500).end();
      }
    });
  }

}
