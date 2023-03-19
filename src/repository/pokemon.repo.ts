import { myDataSource } from '../../service/postgresql';
import { PokemonEntity } from '../entity/pokemon.entity';

export class PokemonRepo {
    constructor(){}

    async getListPokemon(userId) {
        return await myDataSource.getRepository(PokemonEntity)
            .createQueryBuilder("poke")
            .where("poke.user_id = :userId AND poke.release_at IS NULL", {userId: userId})
            .getMany()
    }

    async addPokemon(body: PokemonEntity) {
        return await myDataSource.manager.save(body)
    }

    async getOnePoke(pokeId) {
        return await myDataSource.getRepository(PokemonEntity)
            .createQueryBuilder("poke")
            .where('poke.id = :id', {id: pokeId})
            .getOne()
    }

    async renamePokemon(pokeId, newName, changedName) {
        return await myDataSource.manager.createQueryBuilder()
            .update(PokemonEntity)
            .set({
                poke_name: newName,
                name_changed: changedName
            })
            .where("id = :id", {id: pokeId})
            .execute()
    }

    async releasePokemon(pokeId) {
        return await myDataSource.manager.createQueryBuilder()
            .update(PokemonEntity)
            .set({
                release_at: new Date()
            })
            .where("id = :id", {id: pokeId})
            .execute()
    }
}