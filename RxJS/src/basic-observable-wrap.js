var Rx = require('rxjs/Rx');

var source = Rx.Observable.create(function (observer) {
  var id = setTimeout(function () {
    console.log('started');

    try {
      observer.next(34);
      observer.complete();
    } catch (error) {
      observer.error(error);
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
