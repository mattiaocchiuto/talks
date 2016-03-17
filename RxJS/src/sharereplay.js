var Rx = require('rx');

var source = Rx.Observable
    .interval(300)
    .take(5)
    .map(function (x) {return x + 1});

var published = source
    //.publish().refCount();
    //.shareReplay(5);
    //.shareValue();
    .publish();

// chiamato dopo averlo pubblicato con publish.
published.connect();

//var subscriptionA = published.subscribe(createObserver('A '));

setTimeout(function () {
  //Rx.Observable
    //.return(true)
    //.delay(1000)
    //.concatMap(published)
    published.subscribe(createObserver('      B '));
  }, 1000);

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
