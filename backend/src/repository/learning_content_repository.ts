import { DataSource, Repository } from 'typeorm';
import { LearningContent } from '../entities/learning_content';
import { Injectable } from '@nestjs/common';    
@Injectable()
export class LearningContentRepository {
    private repository: Repository<LearningContent>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(LearningContent);
    }

    public async findBySongID(songID: number): Promise<LearningContent | null> {
        return this.repository.findOne({ where: { songID } });
    }

    public async insertLearningContent(learningContent: LearningContent): Promise<LearningContent> {
        return this.repository.save(learningContent);
    }   
}   
