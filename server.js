const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

console.log(mongoose.version);

mongoose
  .connect(process.env.DATABASE_LOCAL) // local Database connection
  // .connect(DB) // remote Database connection
  .then((con) => {
    // console.log(con.connections);
    console.log("DB connection successful");
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
