var _     = require("lodash"),
    utils = require('../utils/utils');

// /:year/:month/:day
// ?start=xxxxxx&end=xxxxxx
exports.index = function(Task){
  return function(req, res){
    var from, to, date;
    var q = req.query;

    if(!q.date){ date = new Date(); }
    else{ date = new Date(q.date); }

    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    from = (new Date(y, m - 1, d, 0, 0, 0)).getTime();
    to = (new Date(y, m - 1, d, 23, 59, 59)).getTime();

    Task.find({createdAt: {$gte: from, $lte: to}, ownerId: req.user}, function(err, tasks){
      res.send(tasks);
    });
  };
};

exports.create = function(Task){
  return function (req, res) {
    var task = new Task(req.body);
    task.ownerId = req.user.id;
    task.save(function (err) {
      if (err) {
        return res.status(400).send({
          errors: utils.errors(err.errors || err),
          task: task,
          title: 'Create Task error'
        });
      }
      res.send(task);
    });
  };
};

exports.update = function(Task){
  return function (req, res) {
    var id = req.params.id;
    Task.findOne({_id: id}, function(err, task){
      if (err) {
        return res.status(400).send({
          errors: utils.errors(err.errors || err),
          task: task,
          title: 'Finding Task error'
        });
      }
      task = _.extend(task, req.body);
      task.save(function(err, task_){
        if (err) {
          return res.status(400).send({
            errors: utils.errors(err.errors || err),
            task: task_,
            title: 'Update Task error'
          });
        }
        res.send(task_);
      });
    });
  };
};

exports.destroy = function(Task){
  return function(req, res){
    var id = req.params.id;
    Task.remove({_id: id}, function(err){
      if(err){
        return res.status(400).send({
          errors: utils.errors(err.errors || err),
          title: 'Failed to remvoe task.'
        });
      }else{
        res.send({});
      }
    });
  };
};

exports.aggregate = function(Task){
  return function(req, res){
    var q = req.query;
    var from = new Date(q.start);
    var to = new Date(q.end);

    var options = {};
    options.query = {
                      createdAt: {$gte: new Date(from), $lte: new Date(to)},
                      completedAt: {$ne: null},
                      ownerId: req.user.id
                    };

    options.map = function(){
      // var c = this.createdAt;
      var c = this.completedAt;
      var date = {year: c.getFullYear(), month: c.getMonth(), day: c.getDate()};
      emit(date, this.duration);
    };
    options.reduce = function(key, values){
      return Array.sum(values);
    };
    //options.out = {merge: "map_reduce_by_date"};
    //Task.mapReduce(options, function(err, model, stats){

    options.out = {inline: 1};
    Task.mapReduce(options, function(err, results){
      res.send(results);
    });
  };
};

/*
 * use mongo's aggreate function, here is the basic pipeline:
 *
 * 1. $match   - using $match first to filter out what collection we want to operate
 * 2. $project - usering $projection to renaming, adding, removeing or create computed valuses for next step grouping
 * 3. $group   - the real aggregate part
 */
  /* raw mongodb query
  db.tasks.aggregate(
      {
        $match: {
                  ownerId: '51d2ea7eaf690e4f0d000001',
                  completedAt: {$ne: null}
                }
      },
      {
        $project: {
          _id: 0,
          date: {$dayOfMonth: "$completedAt"},
          spent: "$duration"}
      },
      {
        $group: {
          _id: "$date",
          total: {$sum: "$spent"}
        }
      }
  )*/

/* I'm discarding the aggregate for now, alough it is claimed has better perfomence, reasons:
 *   - Mongo group operator $dayOfMonth using ISODate to get the date, this is an issue,
 *     e.g.
 *      "createdAt" : ISODate("2013-09-26T02:02:17.522Z")
 *      the group will think the date is 9/26
 *      but in the local time it is 9/25
 *  - The results is not saved any where, which is good and bad, but if I want to implement a administrator console,
 *    I would prefer not to do the aggreate every time for every user, if I use mapReduce it will save/merge to a
 *    collection
 */
/*
exports.aggregate = function(Task){
  return function(req, res){
    var q = req.query;
    var from = q.start;
    var to = q.end;
    Task.aggregate(
        { $match: {
                    // you can't use the Date string here
                    createdAt: {$gte: new Date(from), $lte: new Date(to)},
                    completedAt: {$ne: null},
                    ownerId: req.user.id
                  }
        },
        { $group: {
                    _id: {
                           year: {$year: "$createdAt"},
                           month: {$month: "$createdAt"},
                           day: {$dayOfMonth: "$createdAt"}
                    },
                    total: {$sum: "$duration"}
                  }
        },
        { $project: {
                      _id: 0,
                      date: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: "$_id.day",
                      },
                      total: 1
                    }
        },
        function(err, results){
          if(err){
            res.status(500).send(err);
            console.log(err);
          }
          res.send(results);
        }
    );
  };
};
*/


// monthly results
exports.aggregateAll = function(Task){
  return function(req, res){
    Task.aggregate(
        { $match: {
                    completedAt: {$ne: null},
                    ownerId: req.user.id
                  }
        },
        { $group: {
                    _id: {
                           year: {$year: "$createdAt"},
                           month: {$month: "$createdAt"}
                    },
                    total: {$sum: "$duration"}
                  }
        },
        { $project: {
                      _id: 0,
                      month: {
                        year: "$_id.year",
                        month: "$_id.month"
                      },
                      total: 1
                    }
        },
        function(err, results){
          if(err){
            res.status(500).send(err);
            console.log(err);
          }
          res.send(results);
        }
    );
  };
};
