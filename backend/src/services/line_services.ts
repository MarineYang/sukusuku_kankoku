import { Inject, Service } from "typedi";
import { DailyOpenAiCron } from '../cron/open_ai_cron';
import { env } from "../env";
import { User } from "../entities/user";
import { UserRepository } from "../repository/user_repository";
import { UserProgress } from "../entities/user_progress";
import { UserProgressRepository } from "../repository/user_progress_repository";

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

  public async addLineChanelFromUser(lineUserID: string, event: any) {
    // 이벤트 유형에 따라 처리
    const user = await this.userRepository.findByLineUserID(lineUserID);

    switch (event.type) {
      case 'follow': // 사용자가 채널을 추가했을 때
        if (user) {
          user.isFollow = true;
          await this.userRepository.updateIsFollow(user);
          console.log(`user isfollow True update . ${lineUserID}`);
          break;
        }

        const newUser = new User();
        newUser.lineUserID = lineUserID;
        newUser.displayName = 'displayName'; // TODO displayName 정보 저장 필요.
        newUser.isFollow = true;
        await this.userRepository.insertUser(newUser);

        console.log(`user isfollow True and user insert . ${lineUserID}`);
        break;
        
      case 'unfollow': // 사용자가 채널을 차단했을 때
        if (user) {
          user.isFollow = false;
          await this.userRepository.updateIsFollow(user);
          console.log(`user isfollow False update . ${lineUserID}`);
          break;
        }
        console.log(`user isfollow False and user not found . ${lineUserID}`);
        break;
        
      case 'message': // 사용자가 메시지를 보냈을 때
        // 이미 저장된 사용자가 아니라면 저장
        // const existingUser = await this.lineService.findByUserId(userID);
        // if (!existingUser) {
        //   await this.lineService.saveUser(userID, true);
        //   console.log(`메시지로부터 새 사용자 추가: ${userID}`);
        // } else {
        //   // 마지막 상호작용 시간 업데이트
        //   await this.lineService.updateLastInteraction(userID);
        // }
        break;
    }
  }


  public async userIsPayed(req: any) {
    // 사용자 등록 로직 (결제완료가 되었다는 가정하에)
    const displayName = req.displayName;

    const user = await this.userRepository.findByLineUserID(displayName);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // TODO displayName 정보 저장 필요.

    if (user.isPayed) {
      return { success: false, message: 'User already paid' };
    }

    user.isPayed = true;
    await this.userRepository.updateIsPayed(user); 

    const newUserProgress = new UserProgress();
    newUserProgress.lineUserID = user.lineUserID;
    newUserProgress.lastContentOrder = 0;
    newUserProgress.completionRate = 0;
    await this.userProgressRepository.insertUserProgress(newUserProgress);

    // TODO 추후에 결제 영수증 정보 저장 필요.

    return { success: true, message: 'User Register Success' };
  }

}