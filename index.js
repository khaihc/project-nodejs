const express = require("express");
const app = express();
const userRouter = require("./routes/user.route");
const env = require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));


//Mongo
const mongoose = require('mongoose');
const connectString = process.env.DB_CONNECT;
mongoose.connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log("Mongo connect error: " + err);
    } else {
        console.log("Mongo connected successfull.");

    }
});

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));


//Router
app.use('', userRouter);

app.listen(3000, function (err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Listening at http://localhost:' + 3000 + '\n')
    }
});