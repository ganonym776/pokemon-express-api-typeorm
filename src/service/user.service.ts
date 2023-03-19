import { UserPokemonEntity } from "../entity/user.entity";
import { UserRepo } from "../repository/user.repo";
import * as jwt from 'jsonwebtoken';
import config from "config";

export class UserService {
    constructor(
        private Repo = new UserRepo
    ){}

    async registerUser(body: UserPokemonEntity) {
        return await this.Repo.registerUser(body)
    }

    async getUserprofile(userId: string) {
        return await this.Repo.getProfile(userId)
    }

    async login(username: string, password: string) {
        const user = await this.Repo.login(username, password)

        if (!user) {
            throw new Error("username atau password salah")
        }
        const payload = {
            id: user.id,
        }

        let accessToken = jwt.sign(payload, config.get<string>('accessTokenPrivateKey'), {
            algorithm: "HS256",
            expiresIn: config.get<string>('accessTokenLife')
        })

        return {
            user_id: user.id,
            user_name: user.nama,
            access_token: accessToken
        }
    }
}