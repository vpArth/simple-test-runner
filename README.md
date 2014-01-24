simple-test-runner
================

#Basic nodejs test suits runner
## Install
  `npm install simple-test-runner`

##Usage:

```javascript
var Tests = require('simple-test-runner')
  , tests = new Tests(__dirname + '/test_suits')
  ;

tests.start();
```
Test suits directory should contain some 'test-' prefixed test suits.
Each suit runs as a separate process.
Sample suit:
```javascript
var Test = require('simple-test-runner').Test
  , test = new Test('simple suit')
  ;
//name, tester(success_callback, fail_callback)
//success or fail should be triggered after test complete
test.add('Success Test', function setEmptyWorker(success, fail) {
  setTimeout(function () {
    if(true) success();
    else fail();
  }, 100);
});

//test that error throwed, third parameter same as expected error(type and message)
test.add('Catch Error Test', Test.catch(function () {
  throw new Error('Some Error');
}, new Error('Some Error')));

test.run(function(res){
  process.exit(res);
});
```

