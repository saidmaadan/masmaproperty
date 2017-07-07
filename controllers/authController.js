const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');


exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res ) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');

};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    next(); //is authorized
    return;
  }
  req.flash('error', 'Oops!, you must be logged in to get access');
  res.redirect('/login');
};

exports.forgot = async (req, res) =>{
  // Chech to see if the user email exists
  const user = await User.findOne({email: req.body.email});
  if(!user){
    req.flash('error', 'A password reset has been mailed to you!');
    return res.redirect('/login');
  }
  // set reset tokens and expiry time
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; //1 hour from now
  await user.save();

  //send user an email with reset token
  const resetURL = `http://${req.headers.host}/reset/${user.resetPasswordToken}`;
  req.flash('success', `You  have been emailed a password reset link. ${resetURL}`);

  // redirect to login page
  res.redirect('/login');

};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now()}
  });
  if(!user){
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/forgot');
  }
  // if there is a user, show the reset password
  res.render('reset', {title: 'Reset your Password'})
};

exports.confirmedPassword = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']){
    next(); //keep going
    return;
  }
    req.flash("error", 'Password do not match');
    res.redirect('back');

};

exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now()}
  });
  if(!user){
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updateUser = await user.save();
  await req.login(updateUser);
  req.flash('success', 'Great! Your password has been reset! You are now logged in!');
  res.redirect('/profile');
}
