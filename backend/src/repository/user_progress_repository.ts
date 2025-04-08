import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user';
import { UserProgress } from '../entities/user_progress';
import { Service } from 'typedi';

@Service()
export class UserProgressRepository {
    private repository: Repository<UserProgress>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(UserProgress);
    }
    
    public async findByUserID(userID: number): Promise<UserProgress | null> {
        return this.repository.findOne({ where: { userID } });
    }

    public async insertUserProgress(userProgress: UserProgress): Promise<UserProgress> {
        return this.repository.save(userProgress);
    }
}