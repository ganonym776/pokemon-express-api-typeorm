import { UserService } from "../service/user.service";
import { UserPokemonEntity } from "../entity/user.entity";
import { myDataSource } from "../../service/postgresql";

const Service = new UserService()

export class UserController {
    constructor(){
    }

    async register(req, res) {
        try {
            if (!req.body.username && !req.body.password && !req.body.nama) {
                throw new Error("invalid request")
            }

            const manager = myDataSource.getRepository(UserPokemonEntity)
            const user: UserPokemonEntity = manager.create({
                username: req.body.username,
                password: req.body.password,
                nama: req.body.nama
            })
            const newUser = await manager.save(user)
            const result = await Service.registerUser(newUser)
            res.status(200).json({
                status: true,
                message: "Berhasil membuat akun"
            })
        } catch(err) {
            console.log(err)
            res.status(400).json({
                status: false,
                message: err.detail? err.detail : err.message
            })
        }
    }
    
    async getProfile(req, res) {
        try {
            const userId = req.user['id']
            const result = await Service.getUserprofile(userId)
            res.status(200).json({
                status: true,
                messgae: "profil didapatkan",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async login(req, res) {
        try {
            const username = req.body.username
            const password = req.body.password
            if (!username || !password) {
                throw new Error("Username atau Password harus diisi")
            }
            console.log("halooo")
            const result = await Service.login(username, password)
            res.status(200).json({
                status: true,
                ...result
            })
        } catch(err) {
            console.log(err)
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }
}