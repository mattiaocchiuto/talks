// ***********************************
// ********** ESEMPIO MOUSE **********
// ***********************************
var draggable = document.querySelector('#draggable');
var draggableContainer = document.querySelector('#draggableContainer');

var draggableMouseDown = Rx.Observable.fromEvent(draggable, 'mousedown');
var draggableConainerMouseMove = Rx.Observable.fromEvent(draggableContainer, 'mousemove');
var draggableConainerMouseUp = Rx.Observable.fromEvent(draggableContainer, 'mouseup');

// Versione base.
var dragMovesBase = draggableMouseDown
  .concatMap(function () {
    return draggableConainerMouseMove
      .takeUntil(draggableConainerMouseUp);
  });

// Versione con Fix per posizione puntatore.
var dragMovesFixed = draggableMouseDown
  .concatMap(function (posByDraggable) {
    return draggableConainerMouseMove
      .map(function (posByContainer) {
        return {
          pageX: posByContainer.pageX - posByDraggable.x,
          pageY: posByContainer.pageY - posByDraggable.y
        };
      })
      .takeUntil(draggableConainerMouseUp);
  });

dragMovesFixed.subscribe(function (e) {
  draggable.style['margin-left'] = e.pageX + 'px';
  draggable.style['margin-top'] = e.pageY + 'px';
});
