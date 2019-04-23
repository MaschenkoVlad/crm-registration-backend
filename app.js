const express = require('express')
const mongoose = require('mongoose')
// парсер для POST запросов
const bodyParser = require('body-parser')
//passport - middleware для проверки подлинности
const passport = require('passport')
const config = require('./db')

const users = require('./registration/user')//!!
// connect to database
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    ()=> { console.log('Database is connected') },
    (err)=> { console.log('Can not connect to the database ' + err) }
)
const app = express();
//анализирует текст в виде URL-кодированных данных 
//(как браузеры отправляют данные обычных форм, установленных в POST) 
//и предоставляет результирующий объект (содержащий ключи и значения) для req.body. 
app.use(bodyParser.urlencoded({ extended: false }));
//анализирует текст как JSON и req.body результирующий объект на req.body.
app.use(bodyParser.json());
// соединть passport + express
app.use(passport.initialize());
require('./registration/passport')(passport);

app.use('./api/users', users)

app.get('/', (req, res) => {
    res.send("Start");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server up and running on PORT: ${PORT}`)
});
