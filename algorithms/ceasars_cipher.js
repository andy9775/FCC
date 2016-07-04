function rot13(str) {

  /*
    A = 65
    Z = 90
    ' ' =
   */
  var result = '';
  for (var i of str) {
    var charCode = i.charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) {
      var location = charCode - 13;
      if ((location ) < 65){;
        location = 91 - (65 - location);
      }
      result += String.fromCharCode(location);
    } else {
      result += i;
    }
  }
  return result;
}

console.log(rot13("SERR PBQR PNZC"));
