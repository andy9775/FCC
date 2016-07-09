/*
    build and handle UI
 */

function buildBoard() {
  /*
    second column should have a left and right boarder
    middle boxes should have a top and bottom border
   */
  for (var columnId = 0; columnId < 3; columnId++) {
    var columnClass = 'column-' + columnId;
    $('.board').append(
      '' +
      '<div class="' + columnClass + '">' +
      '</div>'
    );
    var column = $('.' + columnClass);
    for (var rowId = 0; rowId < 3; rowId++) {
      var clickLocation = (rowId + 1) * ((columnId + 1));
      if ((columnId + 1) == 1) {
        clickLocation += ((rowId) * 2);
      } else if ((columnId + 1) == 2) {
        clickLocation += (rowId);
      }
      var id = 'entry-' + clickLocation;
      var rowClass = 'row-' + rowId;
      column.append(
        '<div class="' + rowClass + ' row' + '"' +
        ' onclick="handleUserClick(' + clickLocation + ')"' +
        ' id="' + id + '">' +
        '</div>'
      );
    }
  }
}
var userChar;
var computerChar;
function clickModalButton(button) {
  userChar = $(button).text().trim();
  computerChar = (userChar == 'X') ? 'O' : 'X';
  handleComputerClick();
  $('.modal').addClass('modal-shrink');
  $('.modal').addClass('modal-gone');
  $('.body').removeClass('body-dim');
  $('.board').removeClass('board-dim');
}

function showWinner(winners) {
  var results = [];
  for (var entry of winners) {
    var rowId = entry.row;
    var columnId = entry.column;
    var clickLocation = (rowId + 1) * ((columnId + 1));
    if ((columnId + 1) == 1) {
      clickLocation += ((rowId) * 2);
    } else if ((columnId + 1) == 2) {
      clickLocation += (rowId);
    }
    results[results.length] = '#entry-' + clickLocation;

  }
  var i = 0;
  var blinkRate = 250;
  var blinkAmount = 6;
  var interval = setInterval(function() {
    $(results[0])[i % 2 == 0 ? 'addClass' : 'removeClass']('row-winner');
    $(results[1])[i % 2 == 0 ? 'addClass' : 'removeClass']('row-winner');
    $(results[2])[i % 2 == 0 ? 'addClass' : 'removeClass']('row-winner');

    if (i++ == blinkAmount) {
      clearInterval(interval);
    }
  }, blinkRate);
  setTimeout(clearBoard, blinkRate * (1 + blinkAmount));
}
var moves = 1;
function clearBoard() {
  for (var i = 1; i < 10; i++) {
    $('#entry-' + i).removeClass('row-winner');
    $('#entry-' + i).text('');
  }
  hasWinner = false;
  board = [[,,], [,,], [,,]];
  moves = 1;

  // start a new move
  handleComputerClick();
}


/*
  Handle game
 */

var board = [[,,], [,,], [,,]]; // each entry is a column
const computer = 1;
const user = 0;
function addToBoard(character, row, column) {
  board[column - 1][row - 1] = character;
}
function canAddToBoard(row, column) {
  return board[column - 1][row - 1] == undefined;
}

function handleUserClick(entry) {
  if (hasWinner || (moves % 2) == 0) {
    return;
  }
  var columnId = ((entry % 3) == 0 ? 3 : (entry % 3));
  var rowId = ((entry + (3 - columnId)) / 3);
  if (canAddToBoard(rowId, columnId)) {
    $('#entry-' + entry).text(userChar);
    addToBoard(user, rowId, columnId);
    checkWinner(rowId, columnId, entry, user);
    handleComputerClick(rowId, columnId, entry);
  }
}

function handleComputerClick(userClickRow, userClickColumn, entry) {
  if (hasWinner) {
    return;
  }
  if (userClickRow == undefined) {
    var randomEntry = Math.round(Math.random() * (9 - 1) + 1);
    var avoid = [2, 8, 4, 6];
    if (avoid.indexOf(randomEntry) != -1) {
      var randomEntry = Math.round(Math.random() * (9 - 1) + 1);
    }
    var columnId = ((randomEntry % 3) == 0 ? 3 : (randomEntry % 3));
    var rowId = ((randomEntry + (3 - columnId)) / 3);

    $('#entry-' + randomEntry).text(computerChar);
    addToBoard(computer, rowId, columnId);

  } else {
    // TODO use a more advanced system than random
    var randomEntry = Math.round(Math.random() * (9 - 1) + 1);
    var columnId = ((randomEntry % 3) == 0 ? 3 : (randomEntry % 3));
    var rowId = ((randomEntry + (3 - columnId)) / 3);
    while (!canAddToBoard(rowId, columnId)) {
      var randomEntry = Math.round(Math.random() * (9 - 1) + 1);
      var columnId = ((randomEntry % 3) == 0 ? 3 : (randomEntry % 3));
      var rowId = ((randomEntry + (3 - columnId)) / 3);
    }
    $('#entry-' + randomEntry).text(computerChar);
    addToBoard(computer, rowId, columnId);
    checkWinner(rowId, columnId, randomEntry, computer);
  }
}

var hasWinner = false;
function checkWinner(rowId, columnId, newEntry, newCharacter) {
  // check row
  var results = [];
  for (var i = 0; i < 3; i++) {
    var entry = board[i][rowId - 1];
    if (entry != newCharacter) {
      break;
    }
    results[results.length] = {
      row: rowId - 1,
      column: i
    };
  }
  if (results.length == 3) {
    // someone has won
    hasWinner = true;
    showWinner(results);
    return;
  }
  // check column
  results = [];
  for (var i = 0; i < 3; i++) {
    var entry = board[columnId - 1][i];
    if (entry != newCharacter) {
      break;
    }
    results[results.length] = {
      row: i,
      column: columnId - 1
    };
  }
  if (results.length == 3) {
    // someone has won
    hasWinner = true;
    showWinner(results);
    return;
  }

  results = [];
  // check (0,0) to (2,2) across
  for (var i = 0; i < 3; i++) {
    var entry = board[i][i];
    if (entry != newCharacter) {
      break;
    }
    results[results.length] = {
      row: i,
      column: i
    };
  }
  if (results.length == 3) {
    hasWinner = true;
    showWinner(results);
    return;
  }

  results = [];
  // check (0,2) to (2,0)

  for (var i = 0, b = 2; i < 3; i++, b--) {
    var entry = board[b][i];
    if (entry != newCharacter) {
      break;
    }
    results[results.length] = {
      row: i,
      column: b
    };
  }

  if (results.length == 3) {
    hasWinner = true;
    showWinner(results);
    return;
  }

  if (++moves == 9) {
    setTimeout(clearBoard, 500);
  }
}

$(document).ready(function() {
  buildBoard();
  if (userChar == undefined) {
    // show modal
    $('.modal').removeClass('modal-gone');
    $('.modal').removeClass('modal-shrink');
    $('.body').addClass('body-dim');
    $('.board').addClass('board-dim');
  }

});
