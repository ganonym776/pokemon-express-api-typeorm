import * as express from "express";
import { PokemonController } from "../src/controller/pokemon.controller";
import { authJwt } from '../middleware/jwt';

const controller = new PokemonController()
const pokemonRoute = express.Router()

pokemonRoute.get("/list", controller.pokemonList)
pokemonRoute.get("/detail/:name", controller.pokemonDetail)
pokemonRoute.get("/types/:name", controller.pokemonType)
pokemonRoute.get("/moves/:name", controller.pokemonMove)
pokemonRoute.get("/mylist", authJwt, controller.pokemonMyList)
pokemonRoute.post("/catch", authJwt, controller.catchPokemon)
pokemonRoute.post("/release", authJwt, controller.releasePokemon)
pokemonRoute.put("/cname", authJwt, controller.renamePokemon)

export default pokemonRoute