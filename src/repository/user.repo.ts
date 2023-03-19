import { UserPokemonEntity } from '../entity/user.entity';
import { myDataSource } from '../../service/postgresql';

export class UserRepo {
    constructor(){}

    async registerUser(body: UserPokemonEntity) {
        return await myDataSource.manager.save(body)
    }

    async login(username, password) {
        return await myDataSource.getRepository(UserPokemonEntity)
            .createQueryBuilder("user")
            .select(['user.id','user.nama'])
            .where("user.username = :username AND user.password = :password", {username: username, password: password})
            .getOne()
    }

    async getProfile(userId) {
        return await myDataSource.manager.find(UserPokemonEntity, {where:{id: userId}})
    }
}