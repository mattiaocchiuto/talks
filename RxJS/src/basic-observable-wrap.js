var Rx = require('rxjs/Rx');

var source = Rx.Observable.create(function subscribe(observer) {
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
  (x) => {
    console.log('Next: ' + x);
  },
  (e) => {
    console.log('Error: ' + e);
  },
  () => {
    console.log('Completed');
  }
);
