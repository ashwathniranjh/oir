const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {validationResult} = require('express-validator/check');



exports.getLogin = (req, res, next) => {
  res.render('index', {
    path: '/',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const rollno = req.body.rollno.toString();
  const password = req.body.password.toString();
  User.findOne({  rollno: rollno })
    .then(user => {
      if (!user) {
       
        return res.redirect('/');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect(`/user/dashboard/${user._id}`);
            });
          }
          else{
             res.redirect('/');
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    msg: undefined
  });
};

exports.postSignup = (req, res, next) => {
  const rollno = req.body.rollno;
  const name = req.body.name;
  console.log(req.body);
  const password = req.body.password.toString();
  const dept = req.body.dept;
  const caption = req.body.caption;
  const errors = validationResult(req);
  const confirmPassword = req.body.confirmPassword;
  if(!errors.isEmpty()){
    req.render( res.render('signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      msg: errors.array()
    }))
  }
  User.findOne({ rollno: rollno })
    .then(userDoc => {
      if (userDoc) {
        
            res.render('auth/signup', {
              path: '/signup',
              pageTitle: 'Signup',
              isAuthenticated: false,
              msg:'Rollno already present'
            });
      }
      if(password === confirmPassword){
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name: name,
            rollno: rollno,
            dept:dept,
            password: hashedPassword,
            caption: caption
          });

          return user.save();
          
        })
        .then(result => {
          res.redirect('/');
        });
    }
    else{
        return res.redirect('/signup');
    }
    })
    .catch(err => {
       
      if( err.code === 11000){
        res.render('auth/signup', {
          path: '/signup',
          pageTitle: 'Signup',
          isAuthenticated: false,
          msg:'Rollno already present'
        });
      }
      console.log(err);
      return res.redirect('/signup');
    });
};

exports.getDashboard = async (req, res, next) => {
    try{
  let user = await User.findById(req.user._id);
    res.render('user/dashboard',{
      path: `/user/dashboard/${user._id}`,
      pageTitle: 'Your Dashboard',
      user: user,
      isAuthenticated: req.session.isLoggedIn
    });

    }
    catch(err){
        console.log(err);
    }
};

exports.postLogout = (req, res, next) => {
  
  req.user.save()
  .then(user => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  })
  .catch(err => {
    console.log(err);
  }
  );
 
};
