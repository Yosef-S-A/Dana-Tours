const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

console.log(mongoose.version);

mongoose
  .connect(process.env.DATABASE_LOCAL) // local Database connection
  // .connect(DB) // remote Database connection
  .then(con => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price:  497
});

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('ERROR: ', err)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
