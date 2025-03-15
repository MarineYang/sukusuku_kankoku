import { request, Router } from 'express';
// import { validateLineSignature } from '../middleware/lineSignatureValidator';
// import { lineBot } from '../services/lineBot';
import { OpenAPI } from 'routing-controllers-openapi';
import { JsonController,
  Post,
  UseBefore,
  Get,
  Res,
  Body,
  HttpCode,
  Req } from 'routing-controllers'
import { Service } from 'typedi';
import { LineService } from '../services/line_services';


const router = Router();

@Service()
@JsonController("/line")
export class LineController {
  constructor(
    private lineService: LineService,

  ) { }
  
  @HttpCode(200)
  @Post("/webhook")
  @OpenAPI({
    summary: "LINE 웹훅 API",
    description: "LINE 메시지 및 이벤트를 처리하는 웹훅 API",
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['message', 'follow'],
                      example: 'message'
                    },
                    message: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          example: 'text'
                        },
                        text: {
                          type: 'string',
                          example: '안녕하세요'
                        }
                      }
                    },
                    source: {
                      type: 'object',
                      properties: {
                        userId: {
                          type: 'string',
                          example: 'test_user_id'
                        },
                        type: {
                          type: 'string',
                          example: 'user'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: '성공',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                }
              }
            }
          }
        }
      }
    }
  })
  async httpTestLogin(@Body() body: any, @Req() request: Request, @Res() res: Response) {
    const event = body.events[0];
    console.log(event);
    
    // switch (event?.type) {
    //   case 'follow':
    //     await lineBot.handleFollow(event.source.userId);
    //     break;
      
    //   case 'message':
    //     if (event.message.type === 'text') {
    //       await lineBot.handleMessage(event.source.userId, event.message.text);
    //     }
    //     break;
    // }

    return { success: true };
  }

  @HttpCode(200)
  @Post("/manual")
  @OpenAPI({
    summary: "prompt test",
    description: "prompt test",
    statusCode: "200",
    responses: {
        "401": {
            description: "Unauthorized"
        },
    }
  })
  async manualPrompt(@Body() body: any, @Req() request: Request, @Res() res: Response) {
    const prompt = body.prompt;
    const result = await this.lineService.sendManualPrompt();
    return { success: true, response: result };
  }

  @HttpCode(200)
  @Post("/user")
  @OpenAPI({
    summary: "user register service",
    description: "user register service",
    statusCode: "200",
    responses: {
        "401": {
            description: "Unauthorized"
        },
    }
  })
  async userReqTest(@Body() body: any, @Req() request: Request, @Res() res: Response) {
    const req = body.req;

    const result = await this.lineService.userRegister(req);
    return { success: true, response: result };
  }
}
