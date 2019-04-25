const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./db')
const cors = require('cors')
const app = express();
const path = require('path')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    ()=> { console.log('Database is connected') },
    (err)=> { console.log('Can not connect to the database ' + err) }
)

const postRoutes = require('./routes/post')

app.use('/', postRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server up and running on PORT: ${PORT}`)
});



