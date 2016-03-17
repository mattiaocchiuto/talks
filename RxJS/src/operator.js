var Rx = require('rx');

var array = [1,2,3];

// *******************************
// ************ ZIP **************
// *******************************
var zipSource = Rx.Observable
  .fromArray(array)
  .zip(
    Rx.Observable.interval(1000),
    function (first, second) {return first;}
  );

//zipSource.subscribe(createObserver('A'));

// ***********************************
// ************ FLATMAP **************
// ***********************************
var flatMapSource = Rx.Observable
  .interval(1000)
  .take(10)
  .flatMap(function (index) {
    return Rx.Observable
      .interval(500)
      .take(10)
      .map(function (x) {return index + ' ' + x})
    });

//flatMapSource.subscribe(createObserver('A'));

/*var firstObserver = createObserver('A');
setTimeout(undefined, 1000);
var secondObserver = createObserver('B');

source.subscribe(firstObserver);
source.subscribe(secondObserver);*/

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

Rx.Observable.fromArray([1,2,3])
  .zip(Rx.Observable.interval(1000))
  .subscribe(function (x) {
    console.log(x);
  })


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
