var Test = require('..').Test
  , test = new Test('simple')
  ;

test.add('Success Test', function setEmptyWorker(success, fail) {
  setTimeout(function () {
    if(true) success();
    else fail();
  }, 100);
});

test.add('Catch Error Test', Test.catch(function () {
  throw new Error('Some Error');
}, new Error('Some Error')));

test.run(function(res){
  process.exit(res);
});
