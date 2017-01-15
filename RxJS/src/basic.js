const Rx = require('rxjs/Rx');

const source$ = Rx.Observable.from([1,2,3]);

const subscription1 = source$.subscribe(
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

const subscription2 = source$.subscribe(
  {
    next: x => console.log('Next: ' + x),
    error: err => console.log('Error: ' + err),
    complete: () => console.log('Completed')
  }
);

subscription1.add(subscription2);

subscription1.unsubscribe();
