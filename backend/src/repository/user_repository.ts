import { DataSource, EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user';
import { Service } from 'typedi';

@Service()
export class UserRepository {
    private repository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(User);
    }

    public async findByLineUserID(lineUserID: string): Promise<User | null> {
        return this.repository.findOne({ where: { lineUserID } });
    }

    public async findUsersByIsPayed(): Promise<User[]> {
        return this.repository.find({ where: { isPayed: true, isFollow: true } });
    }

    public async findByDisplayName(displayName: string): Promise<User | null> {
        return this.repository.findOne({ where: { displayName } });
    }


    public async insertUser(user: User): Promise<User> {
        return this.repository.save(user);
    }

    async updateIsFollow(user: User): Promise<void> {
        await this.repository.update(
          { lineUserID: user.lineUserID }, // TypeORM 에서는 첫번째 줄이 조건이 된다.
          { isFollow: user.isFollow }
        );
      }

    async updateDisplayName(user: User): Promise<void> {
        await this.repository.update(
          { lineUserID: user.lineUserID }, // TypeORM 에서는 첫번째 줄이 조건이 된다.
          { displayName: user.displayName }
        );
    }

    async updateIsPayed(user: User): Promise<void> {
        await this.repository.update(
          { lineUserID: user.lineUserID }, // TypeORM 에서는 첫번째 줄이 조건이 된다.
          { isPayed: user.isPayed }
        );
      }

}