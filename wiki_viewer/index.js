function searchToggle(obj, event) {
  var klass = $(obj).attr('class');
  if (klass.indexOf('search-icon') != -1 && klass.indexOf('search-icon-remove') == -1) {
    $(obj).addClass('search-icon-remove');
    $('#search-input').addClass('search-input-show');
    $('.search-container').addClass('search-container-show');
    window.setTimeout(function() {
      $('#search-input').focus();
    }, 500);
    $('.random-wiki').addClass('random-wiki-gone');
  } else if (klass.indexOf('fa-times') != -1) {
    $('.search-icon').removeClass('search-icon-remove');
    $('#search-input').removeClass('search-input-show');
    $('.search-container').removeClass('search-container-show');
    $('.content').addClass('center-vertical'); // move the search box back to the middle
    $('#search-results').removeClass('search-results-show');
    $('#search-input').val('');
    $('.random-wiki').removeClass('random-wiki-gone');
  }
  event.stopPropagation();
}

function openRandomArticle(){
    window.open('https://en.wikipedia.org/wiki/Special:Random');
}

function submit(obj, event) {
  if (event.which == 13) {
    var searchQuery = $('#search-input').val();
    if (searchQuery == '') {
      // do nothing
    } else {
      $('.content').removeClass('center-vertical');
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        jsonp: "callback",
        dataType: 'jsonp',
        data: {
          format: "json",
          action: "query",
          generator: 'search',
          gsrnamespace: 0,
          gsrlimit: 10,
          gsrsearch: searchQuery,
          prop: 'extracts',
          exsentences: 2,
          exlimit: 'max',
          exintro: ''
        },
        xhrFields: {
          withCredentials: false
        },
        success: successCallback

      });

    }
  }
}

function successCallback(response) {
  var queries = response.query.pages;
  var entries = [];
  for (var id in queries) {
    var entry = queries[id];

    var pageId = entry.pageid;
    var title = entry.title;
    var extraText = entry.extract;
    var index = entry.index;

    var html = '' +
      '<div class="result-entry" onclick="openLink(' + pageId + ')">' +
      '<div class="result-title">' +
      '<h1>' +
      title +
      '</h1>' +
      '</div>' +
      '<div class="result-content">' +
      extraText +
      '</div>' +
      '</div>'

    entries[Number(index)] = html;
  }
  $('#search-results')
    .empty()
    .append(entries)
    .addClass('search-results-show')
    .animate({
      scrollTop: 0
    }, "slow");
}

function openLink(id) {
  var url = 'https://en.wikipedia.org/?curid=' + id;
  window.open(url);
}
