var jwt = require('jwt-simple'),
    moment = require('moment');

exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
};

/*
 *  User authorization routing middleware
 */
exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/'+req.profile.id);
    }
    next();
  }
};

/*
 *  Event authorization routing middleware
 */
exports.event = {
  hasAuthorization : function (req, res, next) {
    if (req.event.ownerId != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/events/'+req.event.id);
    }
    next();
  }
};

/*
 *  Task authorization routing middleware
 */
exports.task = {
  hasAuthorization : function (req, res, next) {
    if (req.task.ownerId != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/tasks/'+req.task.id);
    }
    next();
  }
};

/*
 *  Course authorization routing middleware
 */
exports.course = {
  hasAuthorization : function (req, res, next) {
    if (req.course.owner.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/courses/'+req.course.id);
    }
    next();
  }
};
