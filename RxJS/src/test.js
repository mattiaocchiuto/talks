var Rx = require('rx');
var http = require('http');
var Promise = require('promise');

function createAjaxObservable(val) {
  return function () {
    var promise = new Promise(function (resolve, reject) {
      console.log('qui');
      if (false) {
        resolve('ciao');
      }

      reject('ciao ciao');
    });

    return promise;
  }
}

const makesPromise = () => {
    // console.log('calling');

    // Purposefully reject the Promise.
    // You would return the return value
    // of your call to $.ajax()
    return 'calling';
};

const stream = Rx.Observable.just(5)
  .flatMap((x) => {
    return Rx.Observable.fromPromise(createAjaxObservable(x)).retry(3)
  }
  );

stream.subscribe(
  () => console.log,
  (e) => console.log('error!' + e)
);
