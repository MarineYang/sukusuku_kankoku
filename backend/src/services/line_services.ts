import { Inject, Service } from "typedi";
import { DailyOpenAiCron } from '../cron/open_ai_cron';
import { env } from "../env";
import { User } from "../entities/user";
import { UserRepository } from "../repository/user_repository";
import { UserProgress } from "../entities/user_progress";
import { UserProgressRepository } from "../repository/user_progress_repository";
import axios from 'axios';
import { WebhookEvent } from "@line/bot-sdk";

@Service()
export class LineService {

  constructor(
    private dailyOpenAiCron: DailyOpenAiCron,
    private userRepository: UserRepository,
    private userProgressRepository: UserProgressRepository
  ) { }

  public async sendManualPrompt(artist: string, songTitle: string, currentLyrics: string[], previousLyrics: string[]) {
    const currentLyricsString = currentLyrics.join(", ");
    const previousLyricsString = previousLyrics.join(", ");

    const previousLyricsNote = previousLyrics.length > 0 
    ? `\n\n(참고: 이전에 이미 다룬 가사들인 ${previousLyricsString}은 제외해줘)` 
    : '';

    const prompt = `일본인 한국어 학습자를 위해 K-pop 가사 기반 '오늘의 한국어 문장'을 만들어줘.  
아래 형식을 유지하면서, ${artist} - ${songTitle} 노래에서 다음 가사 문장들을 설명해줘:

문장 : ${currentLyricsString}

${previousLyricsNote}
각 문장에는 한국어 원문, 일본어 번역, 카타카나 발음, 단어 정리, 문법 설명이 포함되어야 해.  
일본인 학습자가 쉽게 이해할 수 있도록 자연스러운 일본어 번역과 쉬운 문법 설명을 제공해줘.

중요: 
1. 각 문장에 나오는 모든 중요 단어를 단어 정리에 포함시켜줘.
2. 문법 설명은 각 문장에서 발견되는 모든 중요한 문법 요소를 설명해줘. 최소 2개 이상의 문법 요소를 설명하도록 해.
3. 마지막에 "설명해드렸습니다" 같은 메타 설명은 절대 포함하지 마.
4. 노래 링크는 실제 유튜브 링크를 제공해줘.
5. 결과는 JSON 형식으로 반환해줘. 아래 형식을 정확히 따라야 함:

{
  "title": "${artist} - ${songTitle}",
  "content": [
    {
      "lyrics": "가사 문장1",
      "japaneseTranslation": "일본어 번역1",
      "pronunciation": "카타카나 발음1",
      "vocabulary": [
        {"word": "단어1", "pronunciation": "발음1", "meaning": "의미1"},
        {"word": "단어2", "pronunciation": "발음2", "meaning": "의미2"}
      ],
      "grammar": [
        {"expression": "문법 표현1", "explanation": "설명1"},
        {"expression": "문법 표현2", "explanation": "설명2"}
      ]
    },
    {
      "lyrics": "가사 문장2",
      "japaneseTranslation": "일본어 번역2",
      "pronunciation": "카타카나 발음2",
      "vocabulary": [
        {"word": "단어1", "pronunciation": "발음1", "meaning": "의미1"},
        {"word": "단어2", "pronunciation": "발음2", "meaning": "의미2"}
      ],
      "grammar": [
        {"expression": "문법 표현1", "explanation": "설명1"},
        {"expression": "문법 표현2", "explanation": "설명2"}
      ]
    }
  ],
  "youtubeLink": "유튜브 링크"
}

JSON 형식을 정확히 지켜서 응답해줘. 추가 설명이나 마크다운 포맷팅 없이 순수 JSON만 반환해.`;
    const jsonResponse = await this.dailyOpenAiCron.sendManualPrompt(prompt, String(env.openai.model), env.openai.maxTokens);

    try {
      const parsedResponse = JSON.parse(jsonResponse);
      return parsedResponse;
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('JSON parse error');
    }
  }

  public async addLineChanelFromUser(lineUserID: string, event: WebhookEvent): Promise<void> {
    try {
      console.log(`사용자 정보 조회 시작: ${lineUserID}`);
      
      // 이벤트 타입 확인
      if (event.type === 'follow') {
        // 팔로우 이벤트인 경우 - 사용자가 봇을 친구 추가
        await this.handleFollowEvent(lineUserID);
      } else if (event.type === 'unfollow') {
        // 언팔로우 이벤트인 경우 - 사용자가 봇 차단
        await this.handleUnfollowEvent(lineUserID);
      } else if (event.type === 'message') {
        // 메시지 이벤트 처리
        await this.handleMessageEvent(lineUserID, event);
      }
      
    } catch (error) {
      // 오류 상세 로깅
      if (axios.isAxiosError(error)) {
        console.error(`Line API 오류 (${error.response?.status}):`, error.response?.data);
        
        // 404 오류 처리 - 사용자가 봇을 차단했거나 존재하지 않는 경우
        if (error.response?.status === 404) {
          console.log(`사용자 ${lineUserID}의 프로필을 찾을 수 없습니다. 봇 차단 또는 존재하지 않는 사용자일 수 있습니다.`);
          
          // 이벤트가 unfollow가 아닌데 404가 발생한 경우 - 사용자 상태 업데이트
          if (event.type !== 'unfollow') {
            await this.handleUnfollowEvent(lineUserID);
          }
        }
      } else {
        console.error('Line 서비스 오류:', error);
      }
    }
  }

  // 팔로우 이벤트 처리
  private async handleFollowEvent(lineUserID: string): Promise<void> {
    try {
      // 사용자 프로필 조회
      const profileResponse = await axios.get(
        `${env.line.baseUrl}/profile/${lineUserID}`, 
        { headers: { Authorization: `Bearer ${env.line.channelAccessToken}` } }
      );
      
      const { displayName, pictureUrl } = profileResponse.data;
      console.log(`사용자 프로필 조회 성공: ${displayName}`);
      
      // 기존 사용자 확인
      const existingUser = await this.userRepository.findByLineUserID(lineUserID);
      
      if (existingUser) {
        // 기존 사용자 업데이트
        existingUser.displayName = displayName;
        existingUser.isFollow = true;
        await this.userRepository.updateIsFollow(existingUser);
        console.log(`기존 사용자 업데이트: ${lineUserID}`);
      } else {
        // 새 사용자 생성
        const newUser = new User();
        newUser.lineUserID = lineUserID;
        newUser.displayName = displayName;
        newUser.isFollow = true;
        newUser.isPayed = false;
        await this.userRepository.insertUser(newUser);
        console.log(`새 사용자 등록: ${lineUserID}`);
      }
      
      // 환영 메시지 전송
      // await this.sendWelcomeMessage(lineUserID);
      
    } catch (error) {
      console.error('팔로우 이벤트 처리 오류:', error);
      throw error; // 상위 함수에서 처리하도록 오류 전파
    }
  }

  // 언팔로우 이벤트 처리
  private async handleUnfollowEvent(lineUserID: string): Promise<void> {
    try {
      // 사용자 상태 업데이트
      const user = await this.userRepository.findByLineUserID(lineUserID);
      
      if (user) {
        user.isFollow = false;
        await this.userRepository.updateIsFollow(user);
        console.log(`사용자 언팔로우 처리: ${lineUserID}`);
      }
    } catch (error) {
      console.error('언팔로우 이벤트 처리 오류:', error);
      throw error;
    }
  }

  // 메시지 이벤트 처리
  private async handleMessageEvent(lineUserID: string, event: WebhookEvent): Promise<void> {
    // 메시지 이벤트 처리 로직
    console.log(`메시지 이벤트 수신: ${lineUserID}`);
    
    // 필요한 경우 메시지 응답 로직 구현
  }

  // 환영 메시지 전송
  private async sendWelcomeMessage(lineUserID: string): Promise<void> {
    try {
      await axios.post(
        `${env.line.baseUrl}/message/push`,
        {
          to: lineUserID,
          messages: [
            {
              type: 'text',
              text: '안녕하세요! 봇을 친구 추가해 주셔서 감사합니다. 🎉'
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
      console.log(`환영 메시지 전송 성공: ${lineUserID}`);
    } catch (error) {
      console.error('환영 메시지 전송 오류:', error);
    }
  }

  public async userIsPayed(req: any) {
    // 사용자 등록 로직 (결제완료가 되었다는 가정하에)
    const displayName = req.displayName;

    const user = await this.userRepository.findByDisplayName(displayName);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.isPayed) {
      return { success: false, message: 'User already paid' };
    }

    user.isPayed = true;
    await this.userRepository.updateIsPayed(user); 

    const newUserProgress = new UserProgress();
    newUserProgress.lineUserID = user.lineUserID;
    newUserProgress.lastContentOrder = 0;
    await this.userProgressRepository.insertUserProgress(newUserProgress);

    // TODO 추후에 결제 영수증 정보 저장 필요.

    return { success: true, message: 'User Register Success' };
  }

}