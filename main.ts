import express from 'express';
import * as bodyParser from 'body-parser';
import multer from 'multer';
import { myDataSource } from './service/postgresql';
import pokemonRoute from './router/pokemon.router';
import userRoute from './router/user.router';
import validateEnv from './service/validateEnv';
const Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024
    }
});

const PORT = process.env.PORT || 8080;
var app = express();

myDataSource.initialize()
  .then(async () => {
    console.log("database connected")

    validateEnv()
    process.env.TZ = 'Asia/Jakarta'

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Route list ---------------------------
    app.use('/api/pokemon', pokemonRoute);
    app.use('/api/user', userRoute);
    // --------------------------------------

    app.listen(PORT, function() {
        console.log("Backend service start");
    });
  })
  .catch((err) => console.log(err))
