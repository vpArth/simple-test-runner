var async = require('async')
  , util = require('util')
  , domain = require('domain')
  , assert = require('assert')
  ;
var Test = function Test(title) {
  var self = this;
  var fns = {};
  var tests = [];

  function add(test, fn) {
    tests.push(test);
    fns[test] = fn;
  }

  function run(next) {
    var d
      , all = tests.length
      , passed = 0;
    util.log('[' + title + '] Start');

    d = domain.create();
    async.eachSeries(tests, function (test, next) {
      function success() {
        passed++;
        util.log('[' + test + '] Success');
        next()
      }

      function fail(e) {
        util.log('[' + test + '] Fail: ' + e.message);
        next()
      }

      var fn = fns[test];
      d.on('error', fail);
      d.run(function () {
        fn(success, fail)
      })
    }, function () {
      util.log('[' + title + '] ' + passed + '/' + all + ' tests passed');
      setTimeout(next, 10, all - passed);
    })
  }

  self.add = add;
  self.nadd = function nadd() {}; // for tests bypassing
  self.run = run;
};
Test.catch = function _catch(fn, err) {
  return function (success, fail) {
    var d = domain.create();
    d.on('error', function (e) {
      try {
        assert.ok(e instanceof err.constructor, 'Wrong Error Type(' + e.constructor.name + ')');
        assert.equal(err.message, e.message, 'Wrong Error message');
        success();
      } catch (e) {
        fail(e);
      }
    });
    d.run(function () {
      setImmediate(function () {
        fn();
        fail(new Error('No exception throwed'));
      });
    });
  };
};

module.exports = Test;

