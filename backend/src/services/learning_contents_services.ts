import { Service } from "typedi";
import { LearningContentRepository } from "../repository/learning_content_repository";
import { LearningContent } from "../entities/learning_content";
import { KpopSongs } from "../entities/kpop_songs";
import { KpopSongsRepository } from "../repository/kpop_songs_repository";
@Service()
export class LearningContentsService {

  constructor(
    private learningContentRepository: LearningContentRepository,
    private kpopSongsRepository: KpopSongsRepository
  ) { }

  public async getLearningContent(songID: number): Promise<LearningContent | undefined> {
    return this.learningContentRepository.findBySongID(songID);
  }

  public async insertLearningContent(req: any) {
    const newKpopSongs = new KpopSongs();
    newKpopSongs.songName = req.songName;
    newKpopSongs.artist = req.artist;
    newKpopSongs.releaseDate = req.releaseDate;
    newKpopSongs.youtubeLink = req.youtubeLink;
    await this.kpopSongsRepository.insertKpopSongs(newKpopSongs);

    // TODO AI에 요청하는 프로세스가 필요함.

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