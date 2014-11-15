var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

// ======== mongoose =============================
var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  google: String,
  facebook: String,
  github: String,
  linkedin: String,
  yahoo: String,
  twitter: String,
  foursquare: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

mongoose.model('User', userSchema);

/*** populate the users collection ***/
if('test' === process.env.NODE_ENV){
  var users = [
    { _id: '5465f88762baaf3155d2a5d3',
      displayName: 'Demo A-String',
      email: 'astring.app@gmail.com',
      password: '12345678'
    }
  ];

  var User = mongoose.model('User');
  User.remove({}, function(err){
    console.log(' ');
    console.log(' => Users collection removed');
  });
  User.create(users, function(err, results){
    console.log(' => Successfully populated test User:\n    %s', JSON.stringify(results));
  });
}
