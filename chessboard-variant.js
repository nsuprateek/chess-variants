let board = null
let game = new Chess()
let $status = $('#status')
let $fen = $('#fen')
let $pgn = $('#pgn')

// ---------------- SELECT PROMOTION -----------------------------------
let promotion = null;
$('#queen').on('click', () => {
  console.log("queen");
  promotion = 'q';
});

$('#rook').on('click', () => {
  console.log("rook");
  promotion = 'r';
});

$('#bishop').on('click', () => {
  console.log("bishop");
  promotion = 'b';
});

$('#knight').on('click', () => {
  console.log("knight");
  promotion = 'n';
});
// --------------------------------------------------------------------

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop (source, target) {
  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: promotion // global variable promotion
  });

  // move.promotion = window.prom
  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen());
}

function updateStatus () {
  let status = '';

  let moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
  console.log(game.board()[1][4]);
}

let config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  // orientation: 'black'
};
board = Chessboard('myBoard', config);

updateStatus();
