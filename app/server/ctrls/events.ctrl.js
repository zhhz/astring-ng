var _      = require('lodash'),
    utils  = require('../utils/utils'),
    moment = require('moment');

// accept uri like:
// ?start=xxxxx&end=xxxxxxxx
exports.index = function(Event) {
  return function(req, res) {
    var q       = req.query,
        from    = q.start,
        to      = q.end;
        ownerId = req.user;

    // none repeat events
    Event.find({start: {$gte: from, $lte: to}, repeat: null, ownerId: ownerId}, function(error, events) {
      var cb = function(repeatEvents){
        events = repeatEvents.concat(events);
        res.send(events);
      };
      findOwnedRepeatEvents(Event, ownerId, from, to, cb);
    });
  };
};

// Create event
exports.create = function(Event){
  return function (req, res) {

    var event = new Event(req.body);
    event.ownerId = req.user;

    event.save(function (err, event, numberAffected) {
      if (err) {
        return res.status(400).send({
          errors: JSON.stringify(err.errors),
          event: JSON.stringify(event),
          title: 'Create Event error'
        });
      }
      res.send(event);
    });
  };
};

exports.update = function(Event){
  return function (req, res) {
    var id = req.params.id;
    Event.findOne({_id: id}, function(err, e){
      if (err) {
        return res.status(400).send({
          errors: utils.errors(err.errors || err),
          event: e,
          title: 'Finding Event error'
        });
      }
      e = _.extend(e, req.body);
      e.save(function(err, e_){
        if (err) {
          return res.status(400).send({
            errors: utils.errors(err.errors || err),
            event: e,
            title: 'Update Event error'
          });
        }
        res.send(e_);
      });
    });
  };
};

exports.destroy = function(Event){
  return function(req, res){
    var id = req.params.id;
    Event.remove({_id: id}, function(err){
      if(err){
        return res.status(400).send({
          errors: utils.errors(err.errors || err),
          title: 'Failed to remvoe Event.'
        });
      }else{
        res.send({});
      }
    });
  };
};

// Find event by id
exports.findEventById = function(Event){
  return function (req, res, next, id) {
      Event.findOne({ _id : id })
          .exec(function (err, event) {
            if (err) return next(err);
            if (!event) return next(new Error('Failed to load Event ' + id));
            req.profile = event;
            next();
          });
  };
};

function findOwnedRepeatEvents(Event, ownerId, from, to, cb){
  Event.find({
      end: {$gte: from},
      start: {$lte: to},
      repeat: {$ne: null},
      ownerId: ownerId
    },
    function(error, events) {
      cb(events);
    }
  );
}

function findAssignedRepeatEvents(ownerId, from, to){
  // TODO:
}
