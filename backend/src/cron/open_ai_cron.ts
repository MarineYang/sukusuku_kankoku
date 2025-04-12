import OpenAI from 'openai';
import { env } from "../env";
import cron from 'node-cron';
import { Service } from 'typedi';
import axios from 'axios';
import { UserRepository } from '../repository/user_repository';

@Service()
export class DailyOpenAiCron {
    private openai: OpenAI;
    private intervalId: NodeJS.Timeout | null = null;
    private isProcessingRequest: boolean = false;

    constructor(
        private userRepository: UserRepository
    ) {
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
                `${env.line.baseUrl}/message/push`,
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
    // public async sendLineMessageToUsers(userIds: string[], message: string): Promise<number> {
    //     let successCount = 0;
        
    //     for (const userId of userIds) {
    //         const success = await this.sendLineMessage(userId, message);
    //         if (success) successCount++;
    //     }
        
    //     return successCount;
    // }


    /**
     * 진도별로 사용자를 그룹화하여 맞춤형 메시지 전송
     * @param userProgressMap 사용자 ID와 진도 레벨을 매핑한 객체
     * @param messagesByLevel 진도 레벨별 메시지 객체
     * @returns 성공적으로 메시지를 받은 사용자 수
     */
    public async sendProgressBasedMessages(
        userProgressMap: Record<string, number>, // { userId: progressLevel }
        messagesByLevel: Record<number, string>  // { progressLevel: message }
    ): Promise<number> {
        // 진도별로 사용자 그룹화
        const usersByProgress: Record<number, string[]> = {};

        // 사용자를 진도별로 분류
        Object.entries(userProgressMap).forEach(([userId, level]) => {
            if (!usersByProgress[level]) {
                usersByProgress[level] = [];
            }
            usersByProgress[level].push(userId);
        });

        let totalSuccessCount = 0;

        // 각 진도 레벨별로 메시지 전송
        for (const [level, users] of Object.entries(usersByProgress)) {
            const numLevel = Number(level);
            const message = messagesByLevel[numLevel];

            if (!message) {
                console.warn(`진도 레벨 ${level}에 대한 메시지가 정의되지 않았습니다.`);
                continue;
            }

            // 해당 진도의 사용자들에게 메시지 전송
            const successCount = await this.sendLineMessageToUsers(users, message);
            totalSuccessCount += successCount;

            console.log(`진도 레벨 ${level}: ${successCount}/${users.length}명에게 메시지 전송 완료`);
        }

        return totalSuccessCount;
    }

    /**
     * 여러 사용자에게 Line 메시지를 한 번에 전송 (Multicast)
     * @param userIds Line 사용자 ID 배열
     * @param message 전송할 메시지
     * @returns 성공적으로 메시지를 받은 사용자 수
     */
    public async sendLineMessageToUsers(userIds: string[], message: string): Promise<number> {
        // Line API는 한 번에 최대 500명에게 메시지를 보낼 수 있음
        const MAX_RECIPIENTS = 500;
        let successCount = 0;

        // 사용자 ID 목록을 500명 단위로 분할
        for (let i = 0; i < userIds.length; i += MAX_RECIPIENTS) {
            const batch = userIds.slice(i, i + MAX_RECIPIENTS);

            try {
                await axios.post(
                    'https://api.line.me/v2/bot/message/multicast',
                    {
                        to: batch,
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

                console.log(`배치 ${Math.floor(i/MAX_RECIPIENTS) + 1} 메시지 전송 성공: ${batch.length}명`);
                successCount += batch.length;
            } catch (error) {
                console.error(`배치 ${Math.floor(i/MAX_RECIPIENTS) + 1} 메시지 전송 실패:`, error);
            }
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
    public startDailyScheduler(): void {
        console.log('daily scheduler 9:00 AM setting !');
        
        // cron.schedule('0 9 * * *', async () => {
        // 5분마다 실행하여 테스트 해보자 .
        cron.schedule('* * * * *', async () => {
            console.log(`schedule working... ${new Date().toISOString()}`);
            try {
                // 1. OpenAI로부터 응답 생성
                // const aiResponse = await this.sendManualPrompt(prompt, model, maxTokens);
                
                // 2. 생성된 응답을 Line 사용자들에게 전송
                const message = 'test message !'
                const users = await this.userRepository.findUsersByIsPayed();
                if (users.length === 0) {
                    console.log('결제 완료한 사용자가 없습니다.');
                    return;
                }
                const userIds = users.map(user => user.lineUserID);
                
                const successCount = await this.sendLineMessageToUsers(userIds, message);
                console.log(`Line 메시지 전송 완료: ${successCount}/${userIds.length} 성공`);
                console.log(`time : ${new Date().toISOString()}`);
                console.log(`--------------------------------`);
                    
            } catch (error) {
                console.error('schedule error: ', error);
            }
        }, {
            timezone: 'Asia/Tokyo'
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
