var env     = process.env.NODE_ENV || 'development',
    config  = require('../config/settings')[env],
    jwt     = require('jwt-simple'),
    request = require('request'),
    qs      = require('querystring'),
    moment  = require('moment');

/**
 * Generate JSON Web Token
 */
function createToken(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(365, 'days').unix(),
    dis: user.displayName
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

exports.login = function(User){
  return function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Wrong email and/or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email and/or password' });
        }
        res.send({ token: createToken(user), displayName: user.displayName });
      });
    });
  };
};

exports.signup = function(User){
  return function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      var user = new User({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
      });
      user.save(function() {
        res.send({ token: createToken(user), displayName: user.displayName });
      });
    });
  };
};


/**
 * Login with Google
 */
exports.google = function(User){
  return function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.GOOGLE_SECRET,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
        // Step 3a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({ google: profile.sub }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.google = profile.sub;
              user.displayName = user.displayName || profile.name;
              user.save(function() {
                var token = createToken(user);
                res.send({ token: token, displayName: user.displayName });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ google: profile.sub }, function(err, existingUser) {
            if (existingUser) {
              return res.send({ token: createToken(existingUser), displayName: existingUser.displayName });
            }
            var user = new User();
            user.google = profile.sub;
            user.displayName = profile.name;
            user.save(function(err) {
              var token = createToken(user);
              res.send({ token: token, displayName: user.displayName });
            });
          });
        }
      });
    });
  };
};


/**
 *--------------------------------------------------------------------------
 * Login with Facebook
 *--------------------------------------------------------------------------
 */
exports.facebook = function(User){
  return function(req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }
      accessToken = qs.parse(accessToken);

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }

        // Step 3a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.facebook = profile.id;
              user.displayName = user.displayName || profile.name;
              user.save(function() {
                var token = createToken(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              var token = createToken(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.facebook = profile.id;
            user.displayName = profile.name;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token, displayName: user.displayName });
            });
          });
        }
      });
    });
  };
};


/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
exports.twitter = function(User){
  return function(req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

    if (!req.query.oauth_token || !req.query.oauth_verifier) {
      var requestTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        callback: config.TWITTER_CALLBACK
      };

      // Step 1. Obtain request token for the authorization popup.
      request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
        var oauthToken = qs.parse(body);
        var params = qs.stringify({ oauth_token: oauthToken.oauth_token });

        // Step 2. Redirect to the authorization screen.
        res.redirect(authenticateUrl + '?' + params);
      });
    } else {
      var accessTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        token: req.query.oauth_token,
        verifier: req.query.oauth_verifier
      };

      // Step 3. Exchange oauth token and oauth verifier for access token.
      request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, profile) {
        profile = qs.parse(profile);

        // Step 4a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.twitter = profile.user_id;
              user.displayName = user.displayName || profile.screen_name;
              user.save(function(err) {
                res.send({ token: createToken(user) });
              });
            });
          });
        } else {
          // Step 4b. Create a new user account or return an existing one.
          User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
            if (existingUser) {
              var token = createToken(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.twitter = profile.user_id;
            user.displayName = profile.screen_name;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token, displayName: user.displayName });
            });
          });
        }
      });
    }
  };
};
