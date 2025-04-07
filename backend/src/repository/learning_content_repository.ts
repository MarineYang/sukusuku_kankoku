import { EntityRepository, Repository } from 'typeorm';
import { LearningContent } from '../entities/learning_content';

@EntityRepository(LearningContent)
export class LearningContentRepository extends Repository<LearningContent> {

    public async findBySongID(songID: number): Promise<LearningContent | undefined> {
        const learningContent = await this.findOne({ where: { songID } });
        return learningContent || undefined;
    }   

    public async insertLearningContent(learningContent: LearningContent): Promise<LearningContent> {
        return this.save(learningContent);
    }   
}   
