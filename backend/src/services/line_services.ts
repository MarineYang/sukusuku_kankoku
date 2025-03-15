import { Inject, Service } from "typedi";
import { DailyOpenAiCron } from '../cron/open_ai/open_ai_cron';
import { env } from "../env";
import { User } from "../entities/user";
import { UserRepository } from "../repository/user_repository";

@Service()
export class LineService {

  constructor(
    private dailyOpenAiCron: DailyOpenAiCron,
    private userRepository: UserRepository
  ) { }

  public async sendManualPrompt() {
    const prompt = `일본인 한국어 학습자를 위해 K-pop 가사 기반 '오늘의 한국어 문장'을 만들어줘.  
아래 형식을 유지하면서, BTS - 봄날 노래에서 가사 3문장을 추천해줘.  
각 문장에는 한국어 원문, 일본어 번역, 카타카나 발음, 단어 정리, 문법 설명이 포함되어야 해.  
일본인 학습자가 쉽게 이해할 수 있도록 자연스러운 일본어 번역과 쉬운 문법 설명을 제공해줘.

📌 오늘의 K-pop 한국어 학습  

**🎵 곡명:** BTS - 봄날 🌸  

## **📍 한국어 가사 & 해석**  

### ① "(첫 번째 가사)"  
- **일본어 번역:** 「(일본어 번역)」  
- **발음 (カタカナ):** **(카타카나 표기)**  

📌 **단어 정리:**  
- **단어1 (カタカナ)** – (일본어 번역)  
- **단어2 (カタカナ)** – (일본어 번역)  
- **단어3 (カタカナ)** – (일본어 번역)  

✅ **문법 설명:**  
**"문법 표현" → 「일본어 설명」**  
👉 (문법의 의미와 활용법을 설명)  

---

### ② "(두 번째 가사)"  
- **일본어 번역:** 「(일본어 번역)」  
- **발음 (カタカナ):** **(카타카나 표기)**  

📌 **단어 정리:**  
- **단어1 (カタカナ)** – (일본어 번역)  
- **단어2 (カタカナ)** – (일본어 번역)  
- **단어3 (カタカナ)** – (일본어 번역)  

✅ **문법 설명:**  
**"문법 표현" → 「일본어 설명」**  
👉 (문법의 의미와 활용법을 설명)  

---

### ③ "(세 번째 가사)"  
- **일본어 번역:** 「(일본어 번역)」  
- **발음 (カタカナ):** **(카타카나 표기)**  

📌 **단어 정리:**  
- **단어1 (カタカナ)** – (일본어 번역)  
- **단어2 (カタカナ)** – (일본어 번역)  
- **단어3 (カタカナ)** – (일본어 번역)  

✅ **문법 설명:**  
**"문법 표현" → 「일본어 설명」**  
👉 (문법의 의미와 활용법을 설명)  

📌 **🎧 (노래 링크)**`;
    const response = await this.dailyOpenAiCron.sendManualPrompt(prompt, String(env.openai.model), env.openai.maxTokens);
    return response;
  }

  public async userRegister(req: any) {
    // 사용자 등록 로직 (결제완료)
    const selectedArtists = req.selectedArtists;
    const userID = req.userID;
    const lineUserID = req.lineUserID;
    const phone_number = req.phone_number;
    const isPayed = req.isPayed;

    const user = await this.userRepository.findByUserID(userID);
    if (user) {
      return { success: false, message: 'User already exists' };
    }

    const newUser = new User();
    newUser.userID = userID;
    newUser.lineUserID = lineUserID;
    newUser.phone_number = phone_number;
    newUser.isPayed = isPayed;
    await this.userRepository.save(newUser); 

    return { success: true, message: 'User Register Success' };
  }
}