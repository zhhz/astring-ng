var path       = require('path'),
    publicPath = path.normalize(__dirname + '/../../public'),
    serverPath = path.normalize(__dirname + '/../../server');

module.exports = {
  development: {
    TOKEN_SECRET: 'dev token secret',
    GOOGLE_SECRET: 'YOUR_SECRET',
    FACEBOOK_SECRET: 'YOUR_SECRET',
    db: 'mongodb://localhost/astringdb_dev',
    publicPath: publicPath,
    serverPath: serverPath,
    port: 3000
  },
  test: {
    TOKEN_SECRET: 'A hard to guess string',
    GOOGLE_SECRET: 'YOUR_SECRET',
    FACEBOOK_SECRET: ' App Secret',
    db: 'mongodb://localhost/astringdb_test',
    publicPath: publicPath,
    serverPath: serverPath,
    port: 3030
  },
  production: {
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'YOUR_SECRET',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'YOUR_SECRET',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'YOUR_SECRET',
    TWITTER_KEY: process.env.TWITTER_KEY || 'YOUR_SECRET',
    TWITTER_SECRET: process.env.TWITTER_SECRET || 'YOUR_SECRET',
    TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'http://a-string.us',
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/astringdb_pro',
    publicPath: publicPath,
    serverPath: serverPath,
    port: 80
  },

  /*
  FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'Foursquare Client Secret',
  GITHUB_SECRET: process.env.GITHUB_SECRET || 'GitHub Client Secret',
  LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'LinkedIn Client Secret',
  TWITTER_KEY: process.env.TWITTER_KEY || 'Twitter Consumer Key',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'Twitter Consumer Secret',
  TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'Twitter Callback Url',
  YAHOO_SECRET: process.env.YAHOO_SECRET || 'Yahoo Client Secret'
  */
};
