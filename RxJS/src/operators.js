var Rx = require('rx');

// *******************************
// ************ ZIP **************
// *******************************
// 1) {1..2..3}
// 2) {0....1....2....3....4....5}
// Zip{1....2....3}
var array = [1,2,3];
var zipSource = Rx.Observable.fromArray(array)
  .zip(
    Rx.Observable.interval(1000),
    (first, second) => first
  );

zipSource.subscribe(createObserver('A'));

// ***********************************
// ************ FLATMAP **************
// ***********************************
var flatMapSource = Rx.Observable.interval(1000).take(5)
  .concatMap((index) => {
    return Rx.Observable
      .interval(500)
      .take(5)
      .map((x) => {return index + ' ' + x})
    });

// flatMapSource.subscribe(createObserver('A'));

// ***********************************
// ************ CONCATMAP ************
// ***********************************
var concatMapSource = Rx.Observable.range(0, 5)
  .concatMap((index) => {
    return Rx.Observable
      .interval(1000)
      .take(index)
      .map(() => index)
  });

// concatMapSource.subscribe(createObserver('A'));

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
