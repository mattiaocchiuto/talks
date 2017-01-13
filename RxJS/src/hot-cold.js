var Rx = require('rx');

var source = Rx.Observable
    .interval(300)
    .take(5)
    .map(function (x) {
      return x + 1
    });

var coldObservable = source;

var sharedObservable = source.share();

var hotObservable = source.publish();
// chiamato dopo averlo pubblicato con publish.
hotObservable.connect();

// Primo Subscriber.
setTimeout(() => {
  var subscriptionA = sharedObservable.subscribe(createObserver('A '));
}, 1000)

// subscriptionA.dispose();

var delayedObservable = Rx.Observable
  .just(true)
  .delay(1000)
  .concatMap(hotObservable); 

// Secondo Subscriber.
// var subscriptionB = delayedObservable.subscribe(createObserver('      B '));


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
