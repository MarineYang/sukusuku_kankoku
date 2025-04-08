import { Service } from "typedi";
import { LearningContentRepository } from "../repository/learning_content_repository";
import { KpopSongs } from "../entities/kpop_songs";
import { KpopSongsRepository } from "../repository/kpop_songs_repository";
import { LineService } from "./line_services";
@Service()
export class LearningContentsService {

  constructor(
    private learningContentRepository: LearningContentRepository,
    private kpopSongsRepository: KpopSongsRepository,
    private lineService: LineService
  ) { }

  public async insertLearningContent(req: any) {

    const kpopSongs = await this.kpopSongsRepository.findBySongName(req.songName);

    const learningContent = await this.learningContentRepository.findBySongID(Number(kpopSongs?.songID));


    let list_previousLyrics = [];
    if (learningContent) {
      list_previousLyrics.push(learningContent.selectedLyrics);
    }

    const newKpopSongs = new KpopSongs();
    newKpopSongs.songName = req.songName;
    newKpopSongs.artist = req.artist;
    newKpopSongs.releaseDate = req.releaseDate;
    newKpopSongs.youtubeLink = req.youtubeLink;
    await this.kpopSongsRepository.insertKpopSongs(newKpopSongs);


    // 프롬프트 처리가 오래걸릴 경우 락이 걸릴 수 있기때문에 timeout 처리를 해야함 .
    // 보통 90초 정도로 추측..약 2,000-3,100 토큰 정도이니..
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout waiting for prompt response')), 90000);
    });

    const result = await Promise.race([
      this.lineService.sendManualPrompt(req.artist, req.songName, req.selectedLyrics, list_previousLyrics),
      timeoutPromise
    ]);

    console.log(result);

    // TODO 이건 바로 못넣는다. ai에 요청하여 파싱 후 데이터를 넣어야함..
    // const contentOrder = req.contentOrder;
    // const selectedLyrics = req.selectedLyrics;
    // const japaneseTranslation = req.japaneseTranslation;
    // const vocabularyList = req.vocabularyList;
    // const grammarPoints = req.grammarPoints;  

    // const newLearningContent = new LearningContent();
    // newLearningContent.contentOrder = contentOrder;
    // newLearningContent.selectedLyrics = selectedLyrics;
    // newLearningContent.japaneseTranslation = japaneseTranslation;
    // newLearningContent.vocabularyList = vocabularyList;
    // newLearningContent.grammarPoints = grammarPoints;
    // await this.learningContentRepository.insertLearningContent(newLearningContent);


    return { success: true, message: 'Learning Content Insert Success' };
  }
}   