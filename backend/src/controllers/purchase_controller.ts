import { Router, Response } from 'express';
// import { validateLineSignature } from '../middleware/lineSignatureValidator';
// import { lineBot } from '../services/lineBot';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { JsonController,
  Post,
  UseBefore,
  Get,
  Res,
  Body,
  HttpCode,
  Req } from 'routing-controllers'
import { Service } from 'typedi';
import { Purchase } from '../entities/purchase';
import { ReqPurchaseDto, ResPurchaseDto } from '../dtos/purchase_dto';
import { PurchaseService } from '../services/purchase_services';

const router = Router();

@Service()
@JsonController("/purchase")
export class PurchaseController {
  constructor(
    private purchaseService: PurchaseService,

  ) { }
  @HttpCode(200)
  @Post("/create-checkout")
  @OpenAPI({
    summary: "결제 세션 생성 API",
    description: "결제 세션 생성 API.",
    statusCode: "200",
    responses: {
      "401": {
        description: "Unauthorized",
      },
    },
  })
//   @ResponseSchema(ResPurchaseDto)
  public async purchase(@Body() req: ReqPurchaseDto, @Res() res: Response) {
    console.log('구매 컨트롤러 호출');
    const resPurchaseDto = await this.purchaseService.processPayment(req);
    
    // Express Response 객체 사용
    return res.status(200).json({
      checkoutUrl: resPurchaseDto.checkoutUrl,
      resultCode: resPurchaseDto.resultCode
    });
  }
}

