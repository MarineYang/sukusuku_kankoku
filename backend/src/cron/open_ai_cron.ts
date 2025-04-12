import OpenAI from 'openai';
import { env } from "../env";
import cron from 'node-cron';
import { Service } from 'typedi';
import axios from 'axios';

@Service()
export class DailyOpenAiCron {
    private openai: OpenAI;
    private intervalId: NodeJS.Timeout | null = null;
    private isProcessingRequest: boolean = false;

   /**
   * @param apiKey OpenAI API 키
   * @param storagePath 마지막 요청 시간을 저장할 디렉토리 경로
   * @param checkIntervalMs 요청 가능 여부를 확인하는 간격 (밀리초)
   */
    constructor() {
        this.openai = new OpenAI({ apiKey: env.openai.apiKey });
    }

    /**
     * OpenAI API에 프롬프트를 전송하는 메서드
     * @param prompt 전송할 프롬프트
     * @param model 사용할 모델
     * @param maxTokens 최대 토큰 수
     * @returns API 응답 또는 null (요청 불가능한 경우)
     */
    public async sendPrompt(
        prompt: string,
        model: string,
        maxTokens: number
    ): Promise<OpenAI.Chat.Completions.ChatCompletion | null> {
        // if (!this.canSendNewRequest()) {
        //     const timeUntilNextRequest = this.getTimeUntilNextRequest();
        //     console.log(`다음 요청까지 ${this.formatTimeRemaining(timeUntilNextRequest)} 남았습니다.`);
        //     return null;
        // }

        try {
            const response = await this.openai.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
            });
            
            return response;
        } catch (error) {
            console.error('OpenAI API 요청 중 오류 발생:', error);
            return null;
        }
    }
    
    public async sendManualPrompt(prompt: string, model: string, maxTokens: number): Promise<string> {
        const response = await this.sendPrompt(prompt, model, maxTokens);
        if (response) {
          console.log('응답:', response.choices[0]?.message?.content);
        }
        return response?.choices[0]?.message?.content || '';
    }

    /**
     * Line 메시지 API를 사용하여 사용자에게 메시지 전송
     * @param userId Line 사용자 ID
     * @param message 전송할 메시지
     * @returns 성공 여부
     */
    private async sendLineMessage(userId: string, message: string): Promise<boolean> {
        try {
            const response = await axios.post(
                'https://api.line.me/v2/bot/message/push',
                {
                    to: userId,
                    messages: [
                        {
                            type: 'text',
                            text: message
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${env.line.channelAccessToken}`
                    }
                }
            );
            
            console.log('Line 메시지 전송 성공:', response.data);
            return true;
        } catch (error) {
            console.error('Line 메시지 전송 실패:', error);
            return false;
        }
    }

    /**
     * 여러 사용자에게 Line 메시지 전송
     * @param userIds Line 사용자 ID 배열
     * @param message 전송할 메시지
     * @returns 성공한 전송 수
     */
    public async sendLineMessageToUsers(userIds: string[], message: string): Promise<number> {
        let successCount = 0;
        
        for (const userId of userIds) {
            const success = await this.sendLineMessage(userId, message);
            if (success) successCount++;
        }
        
        return successCount;
    }

    /**
     * 자동으로 매일 프롬프트를 전송하는 스케줄러 시작
     * @param prompt OpenAI에 전송할 프롬프트
     * @param model 사용할 모델
     * @param maxTokens 최대 토큰 수
     * @param userIds Line 메시지를 받을 사용자 ID 배열
     */
    public startDailyScheduler(prompt: string, model: string, maxTokens: number, userIds: string[]): void {
        console.log('daily scheduler 9:00 AM setting !');
        
        // cron.schedule('0 9 * * *', async () => {
        // 5분마다 실행하여 테스트 해보자 .
        cron.schedule('*/5 * * * *', async () => {
            console.log(`schedule working... ${new Date().toISOString()}`);
            try {
                // 1. OpenAI로부터 응답 생성
                // const aiResponse = await this.sendManualPrompt(prompt, model, maxTokens);
                
                // 2. 생성된 응답을 Line 사용자들에게 전송
                const message = 'test message !'
                let testUsers = []
                testUsers.push('U4af49806ea6bd7091f4dc721a727288e')
                
                const successCount = await this.sendLineMessageToUsers(testUsers, message);
                console.log(`Line 메시지 전송 완료: ${successCount}/${testUsers.length} 성공`);
                
                
            } catch (error) {
                console.error('schedule error: ', error);
            }
        }, {
            timezone: 'Asia/Seoul'
        });

        this.logNextExecutionTime();
    }

    /**
   * 다음 실행 시간을 계산하고 로그로 출력
   */
    private logNextExecutionTime(): void {
      const now = new Date();
      const nextExecution = new Date();

      // 오늘 오전 9시 설정
      nextExecution.setHours(9, 0, 0, 0);

      // 현재 시간이 오전 9시 이후라면 다음 날로 설정
      if (now.getTime() >= nextExecution.getTime()) {
        nextExecution.setDate(nextExecution.getDate() + 1);
      }

      const timeUntilNextExecution = nextExecution.getTime() - now.getTime();
      const hoursUntil = Math.floor(timeUntilNextExecution / (1000 * 60 * 60));
      const minutesUntil = Math.floor((timeUntilNextExecution % (1000 * 60 * 60)) / (1000 * 60));

      console.log(`다음 실행 시간: ${nextExecution.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`);
      console.log(`다음 실행까지 남은 시간: ${hoursUntil}시간 ${minutesUntil}분`);
    }

    /**
     * 스케줄러 중지
     */
    public stopScheduler(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export default DailyOpenAiCron;  
