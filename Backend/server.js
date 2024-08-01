const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// db connect
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB work");
  })
  .catch((error) => {
    console.log("error while connect", error);
  });
// connect
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("listening to port");
});
