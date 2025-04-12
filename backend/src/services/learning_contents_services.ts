import { Service } from "typedi";
import { LearningContentRepository } from "../repository/learning_content_repository";
import { KpopSongs } from "../entities/kpop_songs";
import { KpopSongsRepository } from "../repository/kpop_songs_repository";
import { LineService } from "./line_services";
import { LearningContent } from "../entities/learning_content";
import { formatContentToString } from "../utils/util";

@Service()
export class LearningContentsService {

  constructor(
    private learningContentRepository: LearningContentRepository,
    private kpopSongsRepository: KpopSongsRepository,
    private lineService: LineService
  ) {}

  public async insertLearningContent(req: any) {

    const kpopSongs = await this.kpopSongsRepository.findBySongName(req.songName);
    let learningContent: LearningContent | null = null;
    if (kpopSongs) {
      learningContent = await this.learningContentRepository.findBySongID(Number(kpopSongs?.songID));
    }

    let list_previousLyrics = [];
    if (learningContent) {
      list_previousLyrics.push(learningContent.selectedLyrics);
    }

    const newKpopSongs = new KpopSongs();
    newKpopSongs.songName = req.songName;
    newKpopSongs.artist = req.artist;
    newKpopSongs.releaseDate = req.releaseDate;
    newKpopSongs.youtubeLink = req.youtubeLink;
    const KpopSong = await this.kpopSongsRepository.insertKpopSongs(newKpopSongs);


    // 프롬프트 처리가 오래걸릴 경우 락이 걸릴 수 있기때문에 timeout 처리를 해야함 .
    // 보통 90초 정도로 추측..약 2,000-3,100 토큰 정도이니..
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout waiting for prompt response')), 90000);
    });

    const result = await Promise.race([
      this.lineService.sendManualPrompt(req.artist, req.songName, req.selectedLyrics, list_previousLyrics),
      timeoutPromise
    ]);

    console.log("AI 응답 결과:", JSON.stringify(result).substring(0, 100) + "...");
    
    const formattedContent = formatContentToString(result);
    const newLearningContent = new LearningContent();
    newLearningContent.songID = KpopSong.songID;
    newLearningContent.selectedLyrics = req.selectedLyrics.join(", ");
    newLearningContent.formattedContent = formattedContent;

    await this.learningContentRepository.insertLearningContent(newLearningContent);

    console.log(formattedContent);

    return { success: true, message: formattedContent };
  }

}   



//     const result = `{
//   "title": "BTS - 봄날",
//   "content": [
//     {
//       "lyrics": "보고 싶다 이렇게 말하니까 더 보고 싶다",
//       "japaneseTranslation": "会いたいと言ったら、もっと会いたくなる",
//       "pronunciation": "ポゴ シプダ イロケ マルハニッカ トゥル ポゴ シプダ",
//       "vocabulary": [
//         {"word": "보고 싶다", "pronunciation": "포고 싶다", "meaning": "회보고 싶다 (내가 너를 그리워한다)"},
//         {"word": "말하다", "pronunciation": "말하다", "meaning": "말하다 (말을 하다)"},
//         {"word": "더", "pronunciation": "더", "meaning": "더 (더욱 더)"},
//         {"word": "이렇게", "pronunciation": "이렇게", "meaning": "이렇게 (이런 방식으로)"}
//       ],
//       "grammar": [
//         {"expression": "-니까", "explanation": "-니까는 이유나 근거를 나타내는 접속 표현이다. '말하니까'는 '말했기 때문에'라는 의미로, 어떤 행동이나 감정의 원인을 언급하는 경우에 사용된다."},
//         {"expression": "더", "explanation": "'더'는 비교급으로 사용되어 '더욱'이라는 의미를 가지고 있다. '더 보고 싶다'는 '더 많이 보고 싶다'는 뜻이다."}
//       ]
//     },
//     {
//       "lyrics": "시간은 또 흐르네 화살처럼 날아가네",
//       "japaneseTranslation": "時間はまた流れていく、矢のように飛んでいく",
//       "pronunciation": "시가는 또 흐르네 화살처럼 날아가네",
//       "vocabulary": [
//         {"word": "시간", "pronunciation": "시간", "meaning": "시간 (시간)"},
//         {"word": "흐르다", "pronunciation": "흐르다", "meaning": "흐르다 (흘러가다)"},
//         {"word": "화살", "pronunciation": "화살", "meaning": "화살 (화살)"},
//         {"word": "처럼", "pronunciation": "처럼", "meaning": "처럼 (같이)"},
//         {"word": "날아가다", "pronunciation": "날아가다", "meaning": "날아가다 (날아서 가다)"}
//       ],
//       "grammar": [
//         {"expression": "처럼", "explanation": "'처럼'은 '~처럼'의 형태로, 어떤 것과 비슷하거나 동일한 상태를 나타내기 위한 표현이다. 여기서는 '화살처럼'으로, '화살과 같은 방식으로'라는 의미이다."},
//         {"expression": "은/는", "explanation": "'은/는'는 주제를 나타내는 조사이다. '시간은'은 '시간을 주제로 삼는다'는 의미다."}
//       ]
//     },
//     {
//       "lyrics": "얼마나 더 아파야 네가 돌아올까",
//       "japaneseTranslation": "どれほどもっと痛めば、君が戻ってくるかな",
//       "pronunciation": "얼마나 더 아파야 네가 돌아올까",
//       "vocabulary": [
//         {"word": "얼마나", "pronunciation": "얼마나", "meaning": "얼마나 (얼마나, 얼마나 많은)"},
//         {"word": "더", "pronunciation": "더", "meaning": "더 (더욱 더)"},
//         {"word": "아프다", "pronunciation": "아프다", "meaning": "아프다 (고통스럽다)"},
//         {"word": "돌아오다", "pronunciation": "돌아오다", "meaning": "돌아오다 (되돌아 오다)"}
//       ],
//       "grammar": [
//         {"expression": "아야", "explanation": "동사와 함께 쓰여야 할 경우에 사용되며, '아프다'와 같이 고통을 나타내는 상황을 설명하는 데 쓰인다."},
//         {"expression": "까", "explanation": "'까'는 의문을 나타내는 종결 어미로, 추측이나 의문을 나타내는 질문 형태에 사용된다. 여기서는 '돌아올까'로, '돌아올 것인가?'라는 느낌을 준다."}
//       ]
//     }
//   ],
//   "youtubeLink": "https://www.youtube.com/watch?v=3OnnDyc8dg8"
// }`