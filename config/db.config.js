const mongoose = require("mongoose");

async function connect() {
  try {
    // Não esquecer de criar variável de ambiente com endereço do seu servidor Mongo local em desenvolvimento, e o endereço do cluster do Atlas em produção
    const connection = await mongoose.connect("mongodb+srv://cintiamendesx:4514Emme@ironlibrary.42595.mongodb.net/test", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to DB: ", connection.connection.name);
  } catch (err) {
    console.error("Database connection error: ", err);
  }
}

module.exports = connect;
