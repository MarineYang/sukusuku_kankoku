import { DataSource, EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user';
import { Service } from 'typedi';

@Service()
export class UserRepository {
    private repository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(User);
    }

    public async findByUserID(userID: number): Promise<User | null> {
        return this.repository.findOne({ where: { userID } });
    }

    public async findByLineUserID(lineUserID: number): Promise<User | null> {
        return this.repository.findOne({ where: { lineUserID } });
    }

    public async insertUser(user: User): Promise<User> {
        return this.repository.save(user);
    }

}