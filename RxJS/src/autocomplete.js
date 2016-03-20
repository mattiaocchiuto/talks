(function (global, $, Rx) {

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

    // ************************
    // ****** OBSERVABLE ******
    // ************************
    var keyup = Rx.Observable.fromEvent($input, 'keyup')
      .map((e) => {
        return e.target.value;
      })
      .filter((text) => {
        return text.length > 2;
      })
      .debounce(200)
      .distinctUntilChanged();

    var networkState = Rx.Observable
      .merge(
        Rx.Observable.fromEvent(window, 'online').map(() => true),
        Rx.Observable.fromEvent(window, 'offline').map(() => false)
      )
      .startWith(navigator.onLine)
      .share();

    var searcher = keyup
      // Come flatMap ma mantiene solo l'ultimo.
      .flatMapLatest((x) => {
        return Rx.Observable.fromPromise(searchWikipedia(x))
          .retryWhen((error) => {
            return navigator.onLine ?
              Rx.Observable.timer(3000) :
              networkState;
          });
      });

    // **********************
    // ****** OBSERVER ******
    // **********************
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
