var ajax = $.ajax({
  url: 'http://localhost:3000',
  dataType: 'json'
});

var source = Rx.Observable.fromPromise(ajax)
  .concatMap(function (elems) {
    return Rx.Observable.fromArray(elems);
  })
  .filter(function (elem) {
    return elem.price < 50;
  })
  .map(function (filtered) {
    return filtered.type;
  });

var subscription1 = source.subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  }
);
