var Rx = require('rx');

// *******************************
// ************ ZIP **************
// *******************************
var array = [1,2,3];
var zipSource = Rx.Observable.fromArray(array)
  .zip(
    Rx.Observable.interval(1000),
    (first, second) => first
  );

//zipSource.subscribe(createObserver('A'));

// ***********************************
// ************ FLATMAP **************
// ***********************************
var flatMapSource = Rx.Observable.interval(1000).take(10)
  .flatMap(function (index) {
    return Rx.Observable
      .interval(500)
      .take(10)
      .map(function (x) {return index + ' ' + x})
    });

// flatMapSource.subscribe(createObserver('A'));

// ***********************************
// ************ CONCATMAP ************
// ***********************************
var concatMapSource = Rx.Observable.range(0, 5)
  .concatMap(function (index) {
    return Rx.Observable
      .interval(1000)
      .take(index)
      .map(function () {
        return index
      })
  });

//concatMapSource.subscribe(createObserver('A'));

// *************************************
// ********* OBSERVER GENERICO *********
// *************************************
function createObserver(tag) {
  return Rx.Observer.create(
    function (x) {
      console.log('Next: ' + tag + ' ' + x);
    },

    function (err) {
      console.log('Error: ' + err);
    },

    function () {
      console.log('Completed');
    });
}
