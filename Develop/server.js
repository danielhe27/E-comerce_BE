const express = require('express');
const routes = require('./routes');
// import sequelize connection

//import the connection object
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

//connect to the database before starting the server
sequelize.sync().then
(() => {
// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => 
  console.log(`App listening on port ${PORT}!`));
});
