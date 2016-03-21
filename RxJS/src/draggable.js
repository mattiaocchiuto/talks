(function (window, $, Rx) {

  var draggable = document.querySelector('#draggable');
  var draggableContainer = document.querySelector('#draggableContainer');

  var draggableMouseDown = Rx.Observable.fromEvent(draggable, 'mousedown');
  var draggableConainerMouseMove = Rx.Observable.fromEvent(draggableContainer, 'mousemove');
  var draggableConainerMouseUp = Rx.Observable.fromEvent(draggableContainer, 'mouseup');

  // Versione con Fix per posizione puntatore.
  var dragMovesFixed = draggableMouseDown
    .concatMap(function (posByDraggable) {
      return draggableConainerMouseMove
        .map(function (posByContainer) {
          return {
            newX: posByContainer.x - posByDraggable.offsetX,
            newY: posByContainer.y - posByDraggable.offsetY
          };
        })
        .takeUntil(draggableConainerMouseUp);
    });

  dragMovesFixed.subscribe(function (e) {
    draggable.style['margin-left'] = e.newX + 'px';
    draggable.style['margin-top'] = e.newY + 'px';
  });

}(window, jQuery, Rx));
