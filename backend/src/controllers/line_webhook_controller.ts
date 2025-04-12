import { Request, Response } from 'express';
import { JsonController, Post, Req, Res, HttpCode } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { LineService } from '../services/line_services';
import { env } from '../env';
import { middleware, WebhookEvent } from '@line/bot-sdk';

@Service()
@JsonController('/api/line')
export class LineWebhookController {
  constructor(
    private lineService: LineService
  ) { }

  @Post('/webhook')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Line 웹훅 처리',
    description: 'Line 플랫폼으로부터 이벤트를 수신하고 처리합니다.'
  })
  async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    // Line SDK 미들웨어를 통한 서명 검증
    const lineConfig = {
      channelAccessToken: env.line.channelAccessToken,
      channelSecret: env.line.channelSecret
    };

    // 미들웨어 적용 (서명 검증)
    middleware(lineConfig)(req, res, async () => {
      try {
        console.log('Line 웹훅 요청 수신:', req.body);
        const events: WebhookEvent[] = req.body.events;
        
        for (const event of events) {
          // 사용자 ID 추출
          const userId = event.source.userId;
          
          if (!userId) {
            console.log('사용자 ID가 없는 이벤트:', event);
            continue;
          }
          
          console.log(`이벤트 처리 중: ${event.type}, 사용자: ${userId}`);
          
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
