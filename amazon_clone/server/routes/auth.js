const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/api/signup', async (req, res) =>{
  try{
    //get the data from client
  const {name, email, password} = req.body;
  
  const existingUser = await User.findOne({ email });
  if(existingUser){
    return res.status(400).json({ msg: 'User with same email already exists!' });
  }

  const hashedPassword =  await bcryptjs.hash(password, 8);

  let user = new User({
    email,
    password: hashedPassword,
    name,
  });
  user = await user.save();
  res.json(user);

  }
  catch(e) {
    res.status(500).json({error: e.message});
  }
  
});

//Signin Route
authRouter.post('/api/signin', async (req, res) =>{
  try{
    //save email and password in the body
    const {email, password} = req.body;

    //Check if user already exists
    const user = await User.findOne({ email });
    if(!user){
      res.status(400).json({msg: 'User with this email does not exist!'});
    }

    // Check if the password entered matches the one in the database
    const isMatch =  await bcryptjs.compare(password, user.password);
    if(!isMatch){
      res.status(400).json({msg: 'Incorrect Password'});
    }

    const token = jwt.sign({id: user._id}, "passwordKey");
    res.json({token, ...user._doc});
    
  }catch (e){
    res.status(500).json({error: e.message});
  }
});

//Verify token 
authRouter.post('/tokenIsValid', async (req, res) => {
  try{
    const token = req.header('x-auth-token');
    if(!token) return res.json(false);
    const verified = jwt.verify(token, 'passwordKey');
    if(!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if(!user) return res.json(false);
    res.json(true);
  }catch (e){
    res.status(500).json({error: e.message});
  }
});

// get user data
authRouter.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({...user._doc, token: req.token});
});

module.exports = authRouter;

