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
import { LearningContentsService } from '../services/learning_contents_services';
import { LineService } from '../services/line_services';

const router = Router();

@Service()
@JsonController("/learning-contents")
export class LearningContentsController {
  
  constructor(
    private lineService: LineService,
    private learningContentsService: LearningContentsService
  ) { }

  @HttpCode(200)
  @Post("/insert")
  @OpenAPI({
    summary: "학습 콘텐츠 삽입 API",
    description: "학습 콘텐츠 삽입 API.",   
    statusCode: "200",
    responses: {
      "401": {
        description: "Unauthorized",
      },
    },
  })    
  public async insertLearningContent(@Body() req: any, @Res() res: Response) {
    const learningContent = await this.learningContentsService.insertLearningContent(req);
    console.log(learningContent);

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
    const result = await this.lineService.sendManualPrompt(prompt.artist, prompt.songTitle, prompt.currentLyrics, prompt.previousLyrics);
    return { success: true, response: result };
  }
  
}

export default router;  
