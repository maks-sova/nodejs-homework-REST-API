const mongoose = require("mongoose");


require("dotenv").config();

const { DB_HOST, PORT = 3000 } = process.env;

// const  DB_HOST = "mongodb+srv://maks_sova:pdDqeDuotSLgoYIQ@cluster0.laza5bf.mongodb.net/contacts-reader?retryWrites=true&w=majority"

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const app = require("./app");
