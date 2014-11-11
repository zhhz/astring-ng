var env            = process.env.NODE_ENV || 'development',
    config         = require('../config/config')[env],
    nodemailer     = require('nodemailer'),
    path           = require('path'),
    templatesDir   = path.resolve(__dirname, '..', 'views/mailer'),
    emailTemplates = require('email-templates');

var EmailAddressRequiredError = new Error('email address required');

// create a defaultTransport using gmail and authentication that are
var defaultTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth:    { user: config.mailer.auth.user, pass: config.mailer.auth.pass }
});

module.exports.sendOne = function (templateName, locals, fn) {
  // make sure that we have an user email
  if (!locals.email) {
    return fn(EmailAddressRequiredError);
  }
  // make sure that we have a message
  if (!locals.subject) {
    return fn(EmailAddressRequiredError);
  }
  emailTemplates(templatesDir, function (err, template) {
    if (err) {
      // console.log(err);
      return fn(err);
    }
    // Send a single email
    template(templateName, locals, function (err, html, text) {
      if (err) {
        //console.log(err);
        return fn(err);
      }
      // if we are testing don't send out an email instead return
      // success and the html and txt strings for inspection
      if (env === 'test') {
        return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
      }
      var transport = defaultTransport;
      transport.sendMail({
        from: config.mailer.from,
        to: locals.email,
        subject: locals.subject,
        html: html,
        // generateTextFromHTML: true,
        text: text
      }, function (err, response) {
        if (err) {
          console.log(err);
          return fn(err);
        }else{
          console.log("Message sent: " + response.message);
          return fn(null, response.message, html, text);
        }
      });
    });
  });
};
