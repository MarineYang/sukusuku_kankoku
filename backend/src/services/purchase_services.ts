import { Inject, Service } from "typedi";
import { Purchase } from "../entities/purchase";
import { ReqPurchaseDto, ResPurchaseDto } from "../dtos/purchase_dto";
import axios from 'axios'
import { EResultCode } from "../enums/result_code";

@Service()
export class PurchaseService {
  constructor(
  ) { }

//   public async processPayment(purchase: ReqPurchaseDto): Promise<ResPurchaseDto> {
//     // 객체가 undefined인지 확인하는 방어 코드 추가
//     if (!purchase) {
//       throw new Error('필요한 객체가 초기화되지 않았습니다');
//     }
    
//     // url 속성에 접근하기 전에 존재하는지 확인
//     // const url = purchase || '기본 URL';
    
//     // 결제 처리 로직 추가
//     // 추후에 디비에 저장해야함 .
//     const response = await axios.post('https://vendors.paddle.com/api/2.0/product/generate_pay_link', { // TODO api 문서 읽어봐야함 .
//         vendor_id: process.env.PADDLE_VENDOR_ID,
//         vendor_auth_code: process.env.PADDLE_API_KEY,
//         product_id: purchase.productId,  // Paddle에서 등록한 제품 ID
//         email: "didgudqo13@gmail.com", // user email
//         passthrough: JSON.stringify({ userId: "12345" }) // 추가 데이터 전달 가능
//     });

//     const checkoutUrl = response.data.response.url; 
//     const resPurchaseDto = new ResPurchaseDto();
//     resPurchaseDto.checkoutUrl = checkoutUrl;

//     return resPurchaseDto;
//   }
// }

  public async processPayment(request: Request): Promise<ResPurchaseDto> {
    try {
      const body = await request.json();
      const { productId, language, duration, price } = body;

      // Paddle API 호출하여 체크아웃 세션 생성
      const response = await fetch('https://api.paddle.com/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              price_id: productId, // Paddle 가격 ID
              quantity: 1
            }
          ],
          custom_data: {
            language,
            duration
          },
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '체크아웃 세션 생성 실패');
      }

      const data = await response.json();
      const resPurchaseDto = new ResPurchaseDto();
      resPurchaseDto.checkoutUrl = data.url;
      resPurchaseDto.resultCode = EResultCode.SUCCESS;
      return resPurchaseDto;

    } catch (error) {
      console.error('체크아웃 세션 생성 오류:', error);
      const resPurchaseDto = new ResPurchaseDto();
      resPurchaseDto.resultCode = EResultCode.FAILED;
      return resPurchaseDto;
    }
  }
}
