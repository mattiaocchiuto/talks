const Rx = require('rxjs/Rx');

function createObserver(tag) {
  return {
    next: (x) => {
      console.log('Next: ' + tag + x);
    },
    error: (err) => {
      console.log('Error: ' + err);
    },
    complete: () => {
      console.log('Completed');
    }
  };
}

const source = Rx.Observable
  .interval(300)
  .take(5)
  .map(x =>  x + 1);

const hotObservable = source.publish();
hotObservable.connect();

// const subject = new Rx.Subject();
// const hotObservable = source.multicast(subject);
// hotObservable.connect();

hotObservable.subscribe(createObserver('First '));

setTimeout(() => {
  hotObservable.subscribe(createObserver('Second '));
}, 1000)
