const express = require("express");
const cors = require("cors");
const app = express();
const createTables = require("createTables");
const routes = require("routes");

app.use(
  cors({
    origin: "http://localhost:5173", // Remplacez le port si nécessaire
  })
);
app.use(routes);

app.listen(5000, () => {
  console.log("Server running at http://127.0.0.1:5000/");
});

createTables();
