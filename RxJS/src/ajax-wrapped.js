var http = require('http');
var Rx = require('rx');

function createAjaxObservable(url) {
  return Rx.Observable.create(function (observer) {
    var connection = http.get(url, function (res) {
      console.log("Got response");

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        observer.onNext(chunk);
      });
    }).on('error', function (e) {
      observer.onError(e);
    });

    return function () {
      connection.destroy();
    }
  });
}

var ajaxObservable = createAjaxObservable('http://localhost:3000')
  .map(resp => JSON.parse(resp))
  .concatMap(elems => Rx.Observable.fromArray(elems))
  .filter(elem => elem.price < 50);

var subscription = ajaxObservable.subscribe(
  function (data) {
    console.log(data);
  },
  function (error) {
    console.log(error);
  },
  function (complete) {
    console.log(complete);
  }
);

subscription.dispose();
