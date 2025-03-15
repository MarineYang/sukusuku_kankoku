import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user';
import { UserProgress } from '../entities/user_progress';

@EntityRepository(UserProgress)
export class UserProgressRepository extends Repository<UserProgress> {

    public async findByUserID(userID: number): Promise<UserProgress | undefined> {
        const userProgress = await this.findOne({ where: { userID } });
        return userProgress || undefined;
    }
}