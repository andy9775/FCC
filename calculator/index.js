function buildKeyboard() {
  var buttons = [
    ['AC', '7', '4', '1', '.'],
    ['CE', '8', '5', '2', '0'],
    ['%', '9', '6', '3', 'ANS'],
    ['/', '*', '-', '+', '=']
  ];

  for (var row in buttons) {
    // create a column
    $('.keyboard').append(
      '<div id="col'+ (Number(row) + 1) +'">' +
      '</div>'
    );
    // select the column
    var column = $('#col' + (Number(row) + 1));

    for (button of buttons[row]) {
      var html = '' +
        '<div class="button" onclick="buttonClick(this, event)">' +
        button +
        '</div>'
        // add button to the column
      column.append(html);
    }
  }
}

function buttonClick(button, event) {
  var character = $(button).text();
  var display = $('.display-content');
  switch (character) {
    case 'AC':
      display.text('');
      break;
    case 'CE':
      display.text(display.text().slice(0,-1));
      break;
    case '=':
      display.text(eval(display.text()));
      break;
    case 'ANS':
      break;
    default:
      var existing = display.text();
      display.text(existing + character);

  }
}
$(document).ready(function() {
  buildKeyboard();
});
