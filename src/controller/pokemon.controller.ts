import { PokemonService } from "../service/pokemon.service"

const Service = new PokemonService()

export class PokemonController {
    constructor(){}

    async pokemonList(req, res) {
        try {
            const result = await Service.getListPokemon(req.query.limit, req.query.page)
            res.status(200).json({
                status: true,
                message: "Success",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async pokemonDetail(req, res) {
        try {
            console.log(req.params.name)
            const result = await Service.getDetailPokemon(req.params.name)
            res.status(200).json({
                status: true,
                message: "Success",
                data: result
            })
        } catch(err) {
            console.log(err)
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async pokemonMove(req, res) {
        try {
            const result = await Service.getPokeMove(req.params.name)
            res.status(200).json({
                status: true,
                message: "Success",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async pokemonType(req, res) {
        try {
            const result = await Service.getPokeType(req.params.name)
            res.status(200).json({
                status: true,
                message: "Success",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async pokemonMyList(req, res) {
        try {
            const userId = req.user['id']
            const result = await Service.getUserListPokemon(userId)
            res.status(200).json({
                status: true,
                message: result.length > 0 ? "List didapatkan" : "User tidak memiliki pokemon",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async catchPokemon(req, res) {
        try {
            const userId = req.user['id']
            const result = await Service.catchPokemon(userId, req.body.pokeId)
            res.status(200).json({
                status: result.success ? true : false,
                message: result.success ? "Berhasil mendapatkan pokemon" : "Gagal mendapatkan pokemon",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async releasePokemon(req, res) {
        try {
            const userId = req.user['id']
            const result = await Service.releasePokemon(userId, req.body.id)
            res.status(200).json({
                status: result.is_prime ? true : false,
                message: result.is_prime ? "Berhasil melepas pokemon" : "Gagal melepas pokemon",
                data: result
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }

    async renamePokemon(req, res) {
        try {
            const userId = req.user['id']
            const result = await Service.renamePokemon(userId, req.body.id, req.body.new_name)
            res.status(200).json({
                status: true,
                message: `Pokemon ${result.pokemon} anda berganti nama: ${result.old_name} => ${result.new_name}`
            })
        } catch(err) {
            res.status(400).json({
                status: false,
                message: err.message
            })
        }
    }
}