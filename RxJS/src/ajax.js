var Rx = require('rx');

function fetchUserData(userid) {
  return fetch('https://httpbin.org/?usrid=' + userid);
}

const stopSource = Rx.Observable.fromEvent(document.querySelector('#cancelButton'), 'click');

// Standard Promise
const standardSource$ = Rx.Observable.fromPromise(fetchUserData(userid))
  .map(result => result.name)
  .catch(error => Rx.Observable.of({ error, name: 'fetchUserDataError' }))
  .takeUntil(stopSource);

// Promise with retry logic
const retriableSource$ = Rx.Observable.defer(() => fetchUserData(userid))
  .retryWhen(errors => errors.delay(30000).take(5))
  .map(result => result.name)
  .catch(error => Rx.Observable.of({ error, name: 'fetchUserDataError' }))
  .takeUntil(stopSource);
