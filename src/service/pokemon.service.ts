import { PokemonEntity } from "../entity/pokemon.entity";
import { PokemonRepo } from "../repository/pokemon.repo";
import { pokemonSource } from "../../core/pokemon.core";
import { myDataSource } from "../../service/postgresql";

export class PokemonService {
    constructor(
        private Api = new pokemonSource,
        private Repo = new PokemonRepo
    ){}

    async getListPokemon(limit: number | undefined, page: number | undefined) {
        limit = limit? limit : 20
        page = page? page : 1
        return await this.Api.listPokemon(limit, page)
    }

    async getDetailPokemon(name: string) {
        return await this.Api.pokemonDetail(`https://pokeapi.co/api/v2/pokemon/${name}`)
    }

    async getPokeMove(name: string) {
        const result = await this.Api.pokemonMoves(`https://pokeapi.co/api/v2/move/${name}`)
        if (!result) {
            throw new Error("Pokemon move tidak ditemukan")
        }

        return result
    }

    async getPokeType(name: string) {
        const result = await this.Api.pokemonTypes(`https://pokeapi.co/api/v2/type/${name}`)
        if (!result) {
            throw new Error("Pokemon type tidak ditemukan")
        }

        return result
    }

    async getUserListPokemon(userId: string) {
        return this.Repo.getListPokemon(userId)
    }

    async catchPokemon(userId: string, name: string) {
        if (!name) {
            throw new Error("Nama pokemon wajib diisi")
        }

        const pokemon = await this.Api.listPokeData(`https://pokeapi.co/api/v2/pokemon/${name}`)
        if (!pokemon) {
            throw new Error("Yahh.. Pokemon-nya sudah lari")
        }
        
        const gatcha_number = Math.round(parseFloat(Math.random().toFixed(2)) * 100)
        if (gatcha_number > 50) {
            const manager = myDataSource.manager
            const newPokemon = manager.create(PokemonEntity, {
                user_id: userId,
                poke_id: String(pokemon.id),
                poke_init_name: String(pokemon.name),
                poke_name: String(pokemon.name),
                poke_image: String(pokemon.image),
                name_changed: 0
            })

            await this.Repo.addPokemon(newPokemon)
            return {
                success: true,
                gatcha_number: gatcha_number,
                ...newPokemon
            }
        }
        
        return {
            success: false,
            gatcha_number: gatcha_number
        }
    }

    async releasePokemon(userId: string, pokeId: string) {
        if (!pokeId) {
            throw new Error("Pokemon Id wajib diisi")
        }

        const gatcha = Math.floor(Math.random() * 100)
        if (this.isPrime(gatcha)) {
            await this.Repo.releasePokemon(pokeId)
            return {
                gatcha_number: gatcha,
                is_prime: true
            }
        }

        return {
            gatcha_number: gatcha,
            is_prime: false
        }
    }

    async renamePokemon(userId: string, pokeId: string, name: string) {
        if (!pokeId) {
            throw new Error("Pokemon Id wajib diisi")
        }
        if (!name) {
            throw new Error("Nama pokemon wajib diisi")
        }

        const poke = await this.Repo.getOnePoke(pokeId)
        if (!poke) {
            throw new Error("Pokemon tidak ditemukan")
        }

        const newName = `${name.split('-')[0]}-${this.getFibonacci(poke.name_changed)}`

        await this.Repo.renamePokemon(pokeId, newName, poke.name_changed+1)
        return {
            pokemon: poke.poke_init_name,
            old_name: poke.poke_name,
            new_name: newName
        }
    }

    isPrime(n) {
        for (var i=2; i < n; i++) {
            if (n % i === 0) {
                return false
            }
        }
        return true
    }

    getFibonacci(n) {
        var [a, b] = [0, 1]
        while (n-- > 0) {
            [a, b] = [b, a + b]
        }

        return a
    }
}