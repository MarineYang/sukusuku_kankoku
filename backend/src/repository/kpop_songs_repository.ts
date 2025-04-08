import { DataSource, Repository } from 'typeorm';
import { KpopSongs } from '../entities/kpop_songs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KpopSongsRepository {
    private repository: Repository<KpopSongs>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(KpopSongs);
    }

    public async findBySongID(songID: number): Promise<KpopSongs | null> {
        return this.repository.findOne({ where: { songID } });
    }   

    public async findBySongName(songName: string): Promise<KpopSongs | null> {
        return this.repository.findOne({ where: { songName } });
    }

    public async insertKpopSongs(kpopSongs: KpopSongs): Promise<KpopSongs> {
        return this.repository.save(kpopSongs);
    }   
}   
