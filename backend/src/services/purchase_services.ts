import { Inject, Service } from "typedi";
import { Purchase } from "../entities/purchase";
import { ReqPurchaseDto, ResPurchaseDto } from "../dtos/purchase_dto";
import axios from 'axios'
import { EResultCode } from "../enums/result_code";

@Service()
export class PurchaseService {
  constructor(
  ) { }

  public async processPayment(purchase: ReqPurchaseDto): Promise<ResPurchaseDto> {
    // 객체가 undefined인지 확인하는 방어 코드 추가
    if (!purchase) {
      throw new Error('필요한 객체가 초기화되지 않았습니다');
    }
    
    // url 속성에 접근하기 전에 존재하는지 확인
    // const url = purchase || '기본 URL';
    
    // 결제 처리 로직 추가
    // 추후에 디비에 저장해야함 .
    const response = await axios.post('https://vendors.paddle.com/api/2.0/product/generate_pay_link', { // TODO api 문서 읽어봐야함 .
        vendor_id: process.env.PADDLE_VENDOR_ID,
        vendor_auth_code: process.env.PADDLE_API_KEY,
        product_id: purchase.productId,  // Paddle에서 등록한 제품 ID
        email: "didgudqo13@gmail.com", // user email
        passthrough: JSON.stringify({ userId: "12345" }) // 추가 데이터 전달 가능
    });

    const checkoutUrl = response.data.response.url; 
    const resPurchaseDto = new ResPurchaseDto();
    resPurchaseDto.checkoutUrl = checkoutUrl;

    return resPurchaseDto;
  }
}