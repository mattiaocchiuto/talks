(function (global, $, Rx) {

  // Search Wikipedia for a given term
  function searchWikipedia(term) {
    return function () {
      return $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
          action: 'opensearch',
          format: 'json',
          search: term
        }
      });
    }
  }

  function main() {
    var $input = $('#textInput');
    var $results = $('#results');
    var $networkState = $('.page-header h1');

    var keyup = Rx.Observable.fromEvent($input, 'keyup')
      .map((e) => {
        return e.target.value;
      })
      .filter((text) => {
        return text.length > 2;
      })
      // Passa il valore se tra un valore e l'altro è presente una pausa di almeno 750 ms
      .debounce(200)
      // Solo se il valore è cambiato
      .distinctUntilChanged();

    var networkState = Rx.Observable
      .merge(
        Rx.Observable.fromEvent(window, 'online').map(() => 1),
        Rx.Observable.fromEvent(window, 'offline').map(() => 0)
      )
      .startWith(navigator.onLine ? 1 : 0);

    var searcher = keyup
      // Come flatMap ma non appena l'observable passato alla flat ritorna un nuovo
      // observable si viene disiscritti da quello precedente.
      .flatMapLatest((x) => {
        return Rx.Observable.fromPromise(searchWikipedia(x))
          .retryWhen((error) => {
            return navigator.onLine ?
              Rx.Observable.timer(3000) :
              networkState;
          });
      });

    networkState.subscribe(
      (state) => {
        $networkState
          .removeClass()
          .addClass(state ? 'online' : 'offline');
      }
    );

    searcher.subscribe(
      (data) => {
        $results
          .empty()
          .append ($.map(data[1], function (v) { return $('<li>').text(v); }));
      },
      (error) => {
        $results
          .empty()
          .append($('<li>'))
          .text('Error:' + error);
      });
  }

  main();

}(window, jQuery, Rx));
