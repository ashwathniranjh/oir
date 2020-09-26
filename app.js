const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

const MONGODB_URI =
  'mongodb+srv://ashwath:6rvWNL5fXE4m1o6T@cluster0-ful2l.mongodb.net/login?retryWrites=true&w=majority';

const errorController = require('./controllers/error');

const User = require('./models/user');


const loginss = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });
  
app.set('view engine', 'ejs');
app.set('views', 'views');

const mainRoutes = require('./routes/main');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: loginss
    })
  );

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
  

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });

app.use(mainRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
    console.log("connected!");
  })
  .catch(err => {
    console.log(err);
  });
  
