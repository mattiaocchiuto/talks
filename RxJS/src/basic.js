var Rx = require('rx');

var source$ = Rx.Observable.fromArray([1,2,3]);

var subscription1 = source$.subscribe(
    (val) => {
      console.log('Next: ' + val)
    },
    (error) => {
      console.log('Error: ' + x)
    },
    () => {
      console.log('Completed')
    }
);

var subscription2 = source$.subscribe(
  Rx.Observer.create(
    x => console.log('Next: ' + x),
    err => console.log('Error: ' + err),
    () => console.log('Completed')
 )
);

subscription1.dispose();
subscription2.dispose();
