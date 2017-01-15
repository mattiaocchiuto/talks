(function (scope, $, Rx) {
  const NETWORK_ON = 'online';
  const NETWORK_OFF = 'offline';
  const WIKIPEDIA_API_URL = 'http://en.wikipedia.org/w/api.php';

  function searchWikipedia(term) {
    return $.ajax({
        url: WIKIPEDIA_API_URL,
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
    // Keyup observable - hot for debug
    const inputKeyup$ = Rx.Observable.fromEvent($input, 'keyup');

    const search$ = inputKeyup$
      .map(e => e.target.value)
      .filter(text => text.length > 2)
      .debounceTime(200)
      .distinctUntilChanged();

    const networkOn$ = Rx.Observable.fromEvent(scope, NETWORK_ON).mapTo(true);
    const networkOff$ = Rx.Observable.fromEvent(scope, NETWORK_OFF).mapTo(false);

    // Network observable
    const networkState$ = Rx.Observable
      .merge(
        networkOn$,
        networkOff$
      )
      .startWith(navigator.onLine);

    const searchResult$ = search$
      .switchMap(term =>
        Rx.Observable.defer(() => searchWikipedia(term))
          .retryWhen(error => navigator.onLine ? Rx.Observable.debounceTime(5000) : networkState$)
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

    searchResult$.subscribe(
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
