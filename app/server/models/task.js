var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  title: {type: String},
  ownerId: {type: String},
  startDate: {type: String},
  createdAt: {type: Number, default: (new Date()).getTime()},
  duration: {type: Number},
  completedAt: {type: Date},
  completed: {type: Boolean},
  song: {
    category: String,
    book: String,
    title: String
  },
  refId: {type: String} // this can be anything, e.g. an event's id
});


/**
 * Validations
 */
var validatePresenceOf = function(value){
  return value && value.length;
};


TaskSchema.path('title').validate(function (title) {
  return title.length;
}, 'Title cannot be blank');

TaskSchema.statics = {
  /**
   * List tasks
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  list: function(options, cb){
    var criteria = options.criteria || {};
    this.find(criteria)
      .sort({'startDate': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
};


/**
 * Pre-save hook
 */
TaskSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.title))
    next(new Error('Invalid title'));
  else
    next();
});

mongoose.model('Task', TaskSchema);
