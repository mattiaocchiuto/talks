const Rx = require('rxjs/Rx');

function createObserver(tag) {
  return Rx.Subscriber.create(
    (x) => {
      console.log('Next: ' + tag + x);
    },
    (err) => {
      console.log('Error: ' + err);
    },
    () => {
      console.log('Completed');
    });
}

const source = Rx.Observable
    .interval(300)
    .take(5)
    .map(x =>  x + 1);

const coldObservable = source;

const hotObservable = source.publish();

hotObservable.connect();

hotObservable.subscribe(createObserver('First '));

setTimeout(() => {
  hotObservable.subscribe(createObserver('Second '));
}, 1000)
