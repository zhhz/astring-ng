var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

// 1. Event Schema
var EventSchema = new Schema({
  // compatible with Fullcanlendar
  title: { type: String},
  allDay: {type: Boolean, default: true},
  start: { type: Date, default: Date.now },
  end: { type: Date, default: Date.now},
  // color properties
  backgroundColor: {type: String},
  borderColor: {type: String},
  textColor: {type: String},

  // my own fields
  description: { type: String},
  ownerId: {type: String},
  repeat: {
    frequency: {type: String, enum:['daily', 'weekly', 'monthly', 'yearly']},
    every: {type: Number}
  },
  private: {type: Boolean, default: true}
});

/**
 * Validation
 */
var validatePresenceOf = function (value) {
  return value && value.length;
};

EventSchema.path('title').validate(function (title) {
  return title.length;
}, 'Title cannot be blank');

EventSchema.path('ownerId').validate(function (ownerId) {
  return ownerId.length;
}, 'ownerId cannot be blank');

/**
 * Pre-save hook
 */
EventSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.title))
    next(new Error('Invalid title'));
  else
    next();
});

mongoose.model('Event', EventSchema);

// populate the events collection for test ENV.
if('test' === process.env.NODE_ENV){

  var populateEventsCollection = function (){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    // 3 month ago
    var start = moment().subtract('days', 100).toDate().getTime();
    var events = [
      {
        title: 'Long Long Ago',
          allDay: true,
          start: (new Date(y, m, d, 18, 0, 0, 0)),
          end: (new Date(y, m + 2, d, 18, 0, 0, 0)),

          ownerId: '5465f88762baaf3155d2a5d3',
          repeat:{frequency: 'daily', every: 2}
      },
      {
        title: 'Play a bit',
        allDay: true,
        start: (new Date(y, m, d, 18, 0, 0, 0)),
        ownerId: '5465f88762baaf3155d2a5d3'
      },
      {
        title: 'Suzuki Book1 - rpt evnt',
        allDay: true,
        start: (new Date(start)),
        end: (new Date(y, m + 1, d, 18, 0, 0, 0)),

        ownerId: '5465f88762baaf3155d2a5d3',
        repeat:{frequency: 'daily', every: 1}
      }
    ];

    var Event = mongoose.model('Event');
    Event.remove({}, function(err){ console.log(' => Events collection romoved'); });
    Event.create(events, function(err, results){});
  };
}
