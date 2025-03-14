import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { env } from "../../env";
import cron from 'node-cron';
import { Service } from 'typedi';

@Service()
export class DailyOpenAiCron {
    private openai: OpenAI;
    private intervalId: NodeJS.Timeout | null = null;

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
     * 자동으로 매일 프롬프트를 전송하는 스케줄러 시작
     * @param prompt 전송할 프롬프트
     * @param model 사용할 모델
     * @param maxTokens 최대 토큰 수
     * @param callback 응답 처리 콜백 함수
     */
    public startDailyOpenAIScheduler(prompt: string, model: string, maxTokens: number): void {
        console.log('daily scheduler 9:00 AM setting !');

        cron.schedule('0 9 * * *',async () => {
            console.log(`schedule working... ${new Date().toISOString()}`);
            try {
                const response = await this.sendManualPrompt(prompt, model, maxTokens);
                console.log('schedule work complete: ', response ? 'success' : 'failed');

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
