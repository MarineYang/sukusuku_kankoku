import { EntityRepository, Repository } from 'typeorm';
import { LearningContent } from '../entities/learning_content';
import { KpopSongs } from '../entities/kpop_songs';

@EntityRepository(KpopSongs)
export class KpopSongsRepository extends Repository<KpopSongs> {

    public async findBySongID(songID: number): Promise<KpopSongs | undefined> {
        const kpopSongs = await this.findOne({ where: { songID } });
        return kpopSongs || undefined;
    }   

    public async insertKpopSongs(kpopSongs: KpopSongs): Promise<KpopSongs> {
        return this.save(kpopSongs);
    }   
}   
