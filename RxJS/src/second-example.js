var Rx = require('rx');

var source = Rx.Observable.create(function (observer) {
  var id = setTimeout(function () {
    console.log('started');
    try {
      // throw 'error';
      observer.onNext(34);
      observer.onCompleted();
    } catch (error) {
      observer.onError(error);
    }

  }, 1000);

  return function dispose() {
    console.log('disposed');
    clearTimeout(id);
  };
});

var subscription = source.subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (e) {
    console.log('Error: ' + e);
  },
  function () {
    console.log('Completed');
  }
);

/*setTimeout(function () {
  subscription.dispose();
}, 500);*/
