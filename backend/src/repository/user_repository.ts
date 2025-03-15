import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    public async findByUserID(userID: number): Promise<User | undefined> {
        const user = await this.findOne({ where: { userID } });
        return user || undefined;
    }

    public async findByLineUserID(lineUserID: number): Promise<User | undefined> {
        const user = await this.findOne({ where: { lineUserID } });
        return user || undefined;
    }

}