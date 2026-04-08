const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const {name, email, password} = req.body;
    const user = new User({name, email, password});
    await user.save();
    const token = jwt.sign({id: user._id}, 'secret');
    res.json({message: 'Registered', token});
  } catch (e) {
    res.status(400).json({message: e.message});
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({message: 'Invalid credentials'});
    }
    const token = jwt.sign({id: user._id}, 'secret');
    res.json({message: 'Login success', token});
  } catch (e) {
    res.status(400).json({message: e.message});
  }
};

