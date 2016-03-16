var Rx = require('rx');

var source = Rx.Observable
    .interval(300)
    .take(5)
    .map(function (x) {return x + 1});

var published = source
    //.publish().refCount();
    //.shareReplay(5);
    .shareValue(3);

published.subscribe(createObserver('A '));

Rx.Observable
    .return(true)
    .delay(1000)
    .flatMap(published)
    .subscribe(createObserver('      B '));

function createObserver(tag) {
  return Rx.Observer.create(
    function (x) {
      console.log('Next: ' + tag + x);
    },
    function (err) {
      console.log('Error: ' + err);
    },
    function () {
      console.log('Completed');
    });
}
