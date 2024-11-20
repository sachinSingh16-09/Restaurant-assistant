import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./DAO/restaurantsDAO.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  wtimeoutMS: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  // .then(() => {
  //     console.log(`Database connected on port: ${port}`)
  // })
  .then(async (client) => {
    await RestaurantsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  });

// const express = require('express')

// require('dotenv').config()
// const app = express()

// const port = process.env.PORT || 8000

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

// app.listen(port, () => {
//     console.log(`Listening on port `)
// })
