const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const hashPasswd = await bcrypt.hash(password, 12);

  try{
    const newUser = await User.create({
      username,
      password: hashPasswd
    });
    req.session.user = newUser;
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    })
  }catch(e){
    console.log(e);
    res.status(400).json({
      status: 'fail'
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try{
    const user = await User.findOne({username});

    if(!user){
      return res.status(404).json({
        status: 'Fail',
        message: 'User not found'
      })
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if(!isCorrect){
      return res.status(400).json({
        status: 'fail',
        message: 'incorrect username or password'
      });
    }

    // SUCCESS
    req.session.user = user;
    res.status(200).json({
      status: 'Success'
    });
    // res.end('success');
  }catch(e){
    console.log(e);
    res.status(400).json({
      status: 'fail'
    });
  }
};
