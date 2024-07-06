const express = require("express");
require("dotenv").config();
const app = express();

const { connection } = require("./config/db");

app.use(express.json());

// const { productRouter } = require("./routes/productRoutes");
// app.use("/product", productRouter);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`Connected To DataBase`);
  } catch (error) {
    console.log({ Error: error.message });
  }
  console.log(`server is running at ${process.env.port}`);
});
