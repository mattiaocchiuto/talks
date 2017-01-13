(function (scope, $, Rx) {
  const NETWORK_ON = 'online';
  const NETWORK_OFF = 'offline';

  function searchWikipedia(term) {
    return () =>
      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
          action: 'opensearch',
          format: 'json',
          search: term
        }
      });
  }

  function main() {
    const $input = $('#textInput');
    const $results = $('#results');
    const $networkState = $('.page-header h1');

    // ***********************
    // ****** OBSERVABLE *****
    // ***********************
    // Keyup observable
    const keyup$ = Rx.Observable.fromEvent($input, 'keyup')
      .map(e => e.target.value)
      .filter(text => text.length > 2)
      .debounce(200)
      .distinctUntilChanged();

    // Network observable
    const networkState$ = Rx.Observable
      .merge(
        Rx.Observable.fromEvent(scope, NETWORK_ON).map(() => true),
        Rx.Observable.fromEvent(scope, NETWORK_OFF).map(() => false)
      )
      .startWith(navigator.onLine);

    const searcher$ = keyup$
      .flatMapLatest(term =>
        Rx.Observable.fromPromise(searchWikipedia(term))
          .retryWhen(error => navigator.onLine ? Rx.Observable.timer(3000) : networkState$)
      );

    // ***********************
    // ****** OBSERVERS ******
    // ***********************
    networkState$.subscribe(
      state =>
        $networkState
          .removeClass()
          .addClass(state ? NETWORK_ON : NETWORK_OFF)
    );

    searcher$.subscribe(
      data =>
        $results
          .empty()
          .append ($.map(data[1], v => $('<li>').text(v)))
      ,
      error =>
        $results
          .empty()
          .append($('<li>'))
          .text('Error:' + error)
    );
  }

  main();

}(window, jQuery, Rx));
