var Rx = require('rx');

var array = [1,2,3];

var source = Rx.Observable.fromArray(array);

var subscriber = createObserver();

var subscription = source.subscribe(subscriber);

function createObserver(tag) {
 return Rx.Observer.create(
   function (x) {
     console.log('Next: ' + x);
   },

   function (err) {
     console.log('Error: ' + err);
   },

   function () {
     console.log('Completed');
   }
 );
}

subscription.dispose();
