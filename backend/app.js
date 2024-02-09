const express = require("express");
const mongoose = require("mongoose");
const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/users");
const path = require('path');
const multer = require("./middleware/multer-config");

require("dotenv").config();

const app = express();


console.log(process.env.ACCOUNTNAME);

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.ACCOUNTNAME +
      ":" +
      process.env.PASSWORD +
      "@p0.uslpn1l.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use((req, res) => {
//   res.send("Page non trouvée")
// });


module.exports = app;
