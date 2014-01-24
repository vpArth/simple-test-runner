var fs = require('fs')
  ,  spawn = require('child_process').spawn
  ,  util = require('util')
  ,  Test = require('./test')
  ;

function Tests(directory, options){
  var exitCode = 0
    , timeout = options && options.timeout || 15000
    , self = this
    ;
  function start(){
    util.log('Testing started\n');
    fs.readdir(directory, function (e, files) {
      if (e) throw e;
      console.log(files);
      var tests = files.filter(function (f) {
        return f.slice(0, 'test-'.length) === 'test-'
      });
      var all = tests.length;
      var passed = 0;
      var next = function () {
        if (tests.length === 0) {
          util.log('Testing finished: ' + passed + '/' + all + ' succeed\n');
          process.exit(exitCode);
        }

        var file = tests.shift();
        util.log(file);
        var proc = spawn('node', [ directory + '/' + file ]);

        var killed = false;
        var t = setTimeout(function () {
          proc.kill();
          exitCode += 1;
          killed = true
        }, timeout);

        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
        proc.on('exit', function (code) {
          if (code && !killed) util.log(file + ' failed\n');
          else if (killed) {
            util.log(file + ' timeout\n');
          }
          else {
            util.log(file + ' succeed\n');
            passed++;
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
}


Tests.Test = Test;
module.exports = Tests;