﻿var _      = require("lodash"),
    utils  = require('../utils/utils'),
    moment = require('moment'),
    async  = require('async');

// ?date=2014-11-18
exports.index = function(Task){
  return function(req, res){
    var q = req.query, date;

    if(!q.date){ date = moment().format('YYYY-MM-DD'); }
    else{ date = q.date; }

    Task.find({startDate: date, ownerId: req.user}, function(err, tasks){
      res.send(tasks);
    });
  };
};

exports.create = function(Task){
  return function (req, res) {
    var task = new Task(req.body);
    task.ownerId = req.user;
    task.save(function (err, task_) {
      if (err) {
        return res.status(400).send({
          errors: utils.errors(err.errors || err),
          task: task_,
          title: 'Create Task error'
        });
      }
      res.send(task_);
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

exports.mrByDay = function(Task){
  return function(req, res){
    var q = req.query;
    var from = new Date(q.start);
    var to = new Date(q.end);

    var options = {};
    options.query = {
                      completedAt: {$gte: new Date(from), $lte: new Date(to)},
                      completed:  true,
                      ownerId: req.user
                    };

    options.map = function(){
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

exports.timeline = function(Task){
  return function(req, res){
    Task.distinct('title', {'completed': true, 'ownerId': req.user}, function(err, titles){
      var ret = [];
      async.each(titles, function(title, callback){
        Task.findOne({'ownerId': req.user, 'title': title, 'completed': true}).exec(
        function(err, task){
          ret.push(task);
          callback();
        });
      }, function(err){
        if(err){
          return res.status(400).send({
            errors: utils.errors(err.errors || err),
            title: 'Failed to remvoe task.'
          });
        }else{
          res.send(ret);
        }
      });
    });
  };
};

exports.timeSpent = function(Task){
  return function(req, res){
  console.log(req.user);
    var title = req.params.id;
         // q    = req.query,
         // from = new Date(q.start),
         // to   = new Date(q.end);

    if(!title){ //all the songs
      var opts = { ownerId: req.user, completed: true };
      Task.find(opts, function(err, tasks){
        if(err){
          return res.status(400).send({
            errors: utils.errors(err.errors || err),
            title: 'Failed to query tasks.'
          });
        }else{
          res.send(tasks)
        }
      });
    }else{// for the given song
      var opts = { title: title,
                   ownerId: req.user,
                   // completedAt: {$gte: new Date(from), $lte: new Date(to)},
                   completed: true };
      Task.find(opts, function(err, tasks){
        if(err){
          return res.status(400).send({
            errors: utils.errors(err.errors || err),
            title: 'Failed to query tasks.'
          });
        }else{
          res.send(tasks)
        }
      });
    }
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
 *      "startDate" : ISODate("2013-09-26T02:02:17.522Z")
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
                    startDate: {$gte: new Date(from), $lte: new Date(to)},
                    completedAt: {$ne: null},
                    ownerId: req.user.id
                  }
        },
        { $group: {
                    _id: {
                           year: {$year: "$startDate"},
                           month: {$month: "$startDate"},
                           day: {$dayOfMonth: "$startDate"}
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

/*
 * returns an array of unique songs/tasks complated with total time spent,
 *   ordered by time desc
 */
exports.mrAll = function(Task){
  return function(req, res){
    // var ownerId = req.query.userId;

    var options = {};
    options.query = {
      completed : true,
      // ownerId   : ownerId
      ownerId   : req.user
    };

    options.map = function(){
      emit(this.title, this.duration);
    };
    options.reduce = function(key, values){
      return Array.sum(values);
    };

    // without sorting
    // options.out = {inline: 1};
    // Task.mapReduce(options, function(err, results){res.send(results);});

    options.out = { replace: 'createdCollectionNameForResults' }
    // options.verbose = true; // debug/profiling
    Task.mapReduce(options, function (err, model, stats) {
      // console.log('map reduce took %d ms', stats.processtime)
      // model.find().where('value').gt(10).exec(function (err, docs) { console.log(docs); });
      model.find().sort({'value': -1}).exec(function (err, docs) {
        res.send(docs);
      });
    })
  };
};
