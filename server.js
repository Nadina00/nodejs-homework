const app = require("./app");

require("dotenv").config();
const { connectMongo } = require("./db/connect");

const start = async () => {
  await connectMongo();
  app.listen(3000, () => {
    console.log("Database connection successful");
  });
};

start();
