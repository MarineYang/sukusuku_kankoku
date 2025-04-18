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
    let list_previousLyrics = [];
    const newLearningContent = new LearningContent();
    const newKpopSongs = new KpopSongs();

    if (kpopSongs) { // 기존에 노래가 있다면 기존 노래를 사용
      learningContent = await this.learningContentRepository.findBySongID(Number(kpopSongs?.songID));
      newLearningContent.songID = kpopSongs.songID;

    } else { // 기존에 노래가 없다면 새로 등록한 노래를 사용
      newKpopSongs.songName = req.songName;
      newKpopSongs.artist = req.artist;
      newKpopSongs.releaseDate = req.releaseDate;
      newKpopSongs.youtubeLink = req.youtubeLink;
      const insertedKpopSong = await this.kpopSongsRepository.insertKpopSongs(newKpopSongs);

      newLearningContent.songID = insertedKpopSong.songID;
    }

    if (learningContent) {
      list_previousLyrics.push(learningContent.selectedLyrics);
    }

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
    newLearningContent.selectedLyrics = req.selectedLyrics.join(", ");
    newLearningContent.formattedContent = formattedContent;
    await this.learningContentRepository.insertLearningContent(newLearningContent);

    console.log(formattedContent);

    return { success: true, message: formattedContent };
  }

}