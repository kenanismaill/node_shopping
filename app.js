const express = require('express');

const bodyParser = require("body-parser");
const mongoConnect = require("./util/database");

const app = express();
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const path = require("path");
const User = require('./models/user')


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname + '/public')));

app.use((req, res, next) => {
    User.findById("62320ece215bccb080933267")
        .then(user => {
            console.log(user)
            req.user = new User(user.username, user.email, user._id, user.cart)
            next()
        })
        .catch(err => {
            console.log(err)
        })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
mongoConnect.connectToServer(function (err, client) {
    if (err) console.log(err);
    // start the rest of your app here
    app.listen(3000)
});


