import axios from "axios";
import { link } from "fs";

type defaultProps = {
    name: string,
    url: string
}

type listPokemon = {
    data: listPokemonData[],
    limit: number,
    offset: number,
    total_page: number,
    page: number
}

type listPokemonData = {
    id: number,
    url: string,
    name: string,
    types: string[],
    image: string
}

type pokemonAbilities = {
    name: string,
    effect_changes: string,
    effect_entries: string,
    short_effect: string
}

type pokemonMoves = {
    name: string,
    accuracy: number,
    effect_chance: string | number,
    pp: number,
    priority: number,
    power: number,
    contest_combos: {
        normal: {
            use_before: defaultProps[],
            use_after: defaultProps[]
        },
        super: {
            use_before: defaultProps[],
            use_after: defaultProps[]
        }
    },
    contest_type: string,
    damage_class: string,
    effect_entries: string | Function
}

type pokemonTypes = {
    name: string,
    damage_relations: {
        no_damage_to: defaultProps[],
        half_damage_to: defaultProps[],
        double_damage_to: defaultProps[],
        no_damage_from: defaultProps[],
        half_damage_from: defaultProps[],
        double_damage_from: defaultProps[]
    },
    move_damage_class: string
}

export interface detailPokemon extends listPokemonData {
    abilities: pokemonAbilities[],
    types_detail: pokemonTypes[],
    top_moves: pokemonMoves[]
}

export class pokemonSource {
	constructor(
        private baseURL = "https://pokeapi.co/api/v2/"
    ){}

    async listPokemon(limit: number, page: number ): Promise<listPokemon> {
        let list: listPokemon
        list = {
            data: [],
            limit: limit,
            offset: (page * limit) - limit,
            page: page,
            total_page: null
        }
        console.log(limit, page)

        await axios({
            method: "GET",
            baseURL: this.baseURL,
            url: `pokemon/?limit=${limit}&offset=${list.offset}`
        }).then(async response => {
            list.total_page = Math.ceil(response.data.count / limit)
            for (var value of response.data.results) {  
                list.data.push(await this.listPokeData(value.url))
            }
        }).catch(err => {
            throw new Error("Tidak dapat menampilkan list pokemon")
        })

        return list
    }

    async listPokeData(link: string): Promise<listPokemonData> {
        let listPokemonData: listPokemonData = {
            id: null,
            url: link,
            name: null,
            types: [],
            image: null
        } 

        await axios({
            method: 'GET',
            url: link
        }).then(async response => {
            listPokemonData.id = response.data.id
            listPokemonData.name = response.data.name
            listPokemonData.image = response.data.sprites.other.dream_world.front_default
            for (var value of response.data.types) {
                listPokemonData.types.push(value.type.name)
            }
        })

        return listPokemonData
    }

    async pokemonDetail(link: string): Promise<detailPokemon> {
        let detailPokemon: detailPokemon

        await axios({
            method: 'GET',
            url: link
        }).then(async response => {
            const data = response.data
            const abilities = data.abilities
            const moves = data.moves
            const detail_types = data.types

            detailPokemon = {
                id:  data.id,
                url: link,
                name:  data.name,
                types: [],
                image:  data.sprites.other.dream_world.front_default,
                types_detail: [],
                abilities: [],
                top_moves: []
            }
            
            for (var value of data.types) {
                detailPokemon.types.push(value.type.name)
            }

            for (var value of moves.slice(0, 3)) {
                detailPokemon.top_moves.push(await this.pokemonMoves(value.move.url))
            }

            for (var value of detail_types) {
                detailPokemon.types_detail.push(await this.pokemonTypes(value.type.url))
            }

            for (var value of abilities) {
                detailPokemon.abilities.push(await this.pokemonAbilities(value.ability.url, value.ability.name))
            }
            
        }).catch(err => {
            throw new Error("Pokemon tidak ditemukan")
        })

        return detailPokemon
    }

    async pokemonAbilities(link: string, name: string): Promise<pokemonAbilities> {
        let ability: pokemonAbilities = {
            name:  name,
            effect_changes: null,
            effect_entries: null,
            short_effect: null
        }

        await axios({
            method: 'GET',
            url:link
        }).then(response => {
            const data = response.data
            for (var value of (data.effect_changes).length > 0 ? data.effect_changes[0].effect_entries : []) {
                if (value.language.name == 'en') {
                    ability.effect_changes = value.effect
                }
            }

            for (var value of data.effect_entries) {
                if (value.language.name == 'en') {
                    ability.effect_entries = value.effect
                    ability.short_effect = value.short_effect
                }
            }
        }).catch(err => {
            console.log(err)
        })

        return ability
    }

    async pokemonMoves(link: string): Promise<pokemonMoves> {
        let pokemonMoves: pokemonMoves

        await axios({
            method:'GET',
            url: link
        }).then(async response => {
            const data = response.data
            pokemonMoves = {
                name: data.name,
                accuracy: data.accuracy,
                effect_chance: data.effect_chance,
                pp: data.pp,
                priority: data.priority,
                power: data.power,
                contest_combos: {
                    normal: {
                        use_before: [],
                        use_after: [],
                    },
                    super: {
                        use_before: [],
                        use_after: [],
                    }
                },
                contest_type: data.contest_type.name,
                damage_class: data.damage_class.name,
                effect_entries: (data.effect_entries).length > 0 ? () => {
                    for (var value of data.effect_entries) {
                        if (value.language.name === 'en') {
                            return value.effect
                        }
                        return null
                    }
                } : null
            }

            for (var key in data.contest_combos.normal) {
                for (var value of (data.contest_combos.normal[key] != null ? data.contest_combos.normal[key] : [])) {
                    pokemonMoves.contest_combos.normal[key].push({
                        name: value.name,
                        url: value.url
                    } as defaultProps )
                }
            }

            for (var key in data.contest_combos.super) {
                for (var value of (data.contest_combos.super[key] != null ? data.contest_combos.normal[key] : [])) {
                    pokemonMoves.contest_combos.super[key].push({
                        name: value.name,
                        url: value.url
                    } as defaultProps )
                }
            }
        }).catch(err => {
            console.log(err)
        })

        return pokemonMoves
    }

    async pokemonTypes(link: string): Promise<pokemonTypes> {
        let pokemonTypes: pokemonTypes

        await axios({
            method:'GET',
            url: link
        }).then(response => {
            const data = response.data
            pokemonTypes = {
                name: data.name,
                damage_relations: {
                    no_damage_to: [],
                    half_damage_to: [],
                    double_damage_to: [],
                    no_damage_from: [],
                    half_damage_from: [],
                    double_damage_from: []
                },
                move_damage_class: data.move_damage_class.name
            }

            for (var key in pokemonTypes.damage_relations) {
                for (var value of data.damage_relations[key]) {
                    pokemonTypes.damage_relations[key].push({
                        name: value.name,
                        url: value.url
                    } as defaultProps )
                }
            }
        }).catch(err => {
            console.log(err)
        })

        return pokemonTypes
    }
}