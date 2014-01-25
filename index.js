var fs = require('fs')
  , spawn = require('child_process').spawn
  , util = require('util')
  , Test = require('./test')
  ;

var Tests = function Tests(directory, options) {
  //noinspection MagicNumberJS
  var exitCode = 0
    , timeout = options && options.timeout || 15000
    , prefix = options && options.prefix || 'test-'
    , self = this
    ;

  function start() {
    util.log('Testing started\n');
    fs.readdir(directory, function (e, files) {
      var tests, all, passed, next;
      if (e) {
        throw e;
      }
      tests = files.filter(function (f) {
        return f.slice(0, prefix.length) === prefix;
      });
      all = tests.length;
      passed = 0;
      next = function next() {
        var t, killed, proc, file;
        if (tests.length === 0) {
          util.log('Testing finished: ' + passed + '/' + all + ' succeed\n');
          process.exit(exitCode);
        }

        file = tests.shift();
        util.log(file);
        proc = spawn('node', [ directory + '/' + file ]);

        killed = false;
        t = setTimeout(function () {
          proc.kill();
          exitCode += 1;
          killed = true
        }, timeout);

        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
        proc.on('exit', function (code) {
          if (code && !killed) {
            util.log(file + ' failed\n');
          }
          else {
            if (killed) {
              util.log(file + ' timeout\n');
            }
            else {
              util.log(file + ' succeed\n');
              passed++;
            }
          }
          exitCode += code || 0;
          clearTimeout(t);
          next()
        })
      };
      next()
    })
  }

  self.start = start;
};


Tests.Test = Test;
module.exports = Tests;