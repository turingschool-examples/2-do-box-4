
var filteredIdeas = [];
var ideaList = getFromLocalStorage() || [];
var indexOfOriginalObject;
loadIdeasFromStorage();

$('.article-container').on('click', '#delete-btn', removeIdea);
$('.article-container').on('click', '#downvote-btn', changeDownvoteQuality);
$('.article-container').on('click', '#upvote-btn', changeUpvoteQuality);
$('.article-container').on('focusout', '.description', replaceEditedDescription);
$('.article-container').on('focusout', 'h2', replaceEditedTitle);

$('#body-input').on('input', function() {
  toggleSaveDisable();
});

$('#body-input').on('keydown', function(e) {
  if(e.keyCode === 13) {
    e.preventDefault();
  }
});

$('#search-input').on('input', filterIdeas);
$('#submit-btn').on('click', submitNewIdea);

$('#title-input').on('input', function() {
  toggleSaveDisable();
});

$(window).on('keyup', function(e) {
  if(e.keyCode === 13 && ($('#title-input').val() !== '') && ($('#body-input').val() !== '')){
    toggleSaveDisable();
    $('#submit-btn').trigger('click');
  }
});

$(window).on('load', function() {
  $('#title-input').focus();
});

function changeDownvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switchDownvote(editedObject);
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function changeUpvoteQuality(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  localStorage.clear();
  switchUpvote(editedObject);
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function clearInputs() {
  $('#title-input').val('');
  $('#body-input').val('');
  $('#title-input').focus();
  toggleSaveDisable();
}

function displayFilteredList() {
  $('.article-container').children().remove();
  filteredIdeas.forEach(function(idea) {
    prependExistingIdeas(idea);
  });
}

function findIndexIdeaList(id) {
  var list = getFromLocalStorage();
  var mapIdea = list.map(function(idea) {
    return idea.id;
  })
  var specificID = mapIdea.filter(function(number) {
    if (parseInt(id) === number) {
      return number;
    }
  })
  var idAsNumber = specificID[0];
  var foundObject;
  list.forEach(function(object, index) {
    if (parseInt(object.id) === idAsNumber) {
      foundObject = object;
      indexOfOriginalObject = index;
      return object;
    }
  })
  return foundObject;
}

function filterIdeas() {
  var searchInput = $('#search-input').val().toUpperCase();
  ideaList = getFromLocalStorage() || [];
  if(searchInput === '') {
    filteredIdeas = [];
    displayFilteredList();
    loadIdeasFromStorage();
  } else {
      filteredIdeas = ideaList.filter(function(ideaObject) {
      return ((ideaObject.title.toUpperCase().indexOf(searchInput) > -1) || (ideaObject.body.toUpperCase().indexOf(searchInput) > -1) || (ideaObject.quality.toUpperCase().indexOf(searchInput) > -1))
    })
    displayFilteredList();
  }
}

function getFromLocalStorage() {
  var parseIdeaList = JSON.parse(localStorage.getItem('ideas'));
  return parseIdeaList;
}

function ideaObject(title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = quality;
}

function loadIdeasFromStorage() {
  if (localStorage.getItem('ideas')) {
    ideaList = getFromLocalStorage();
    ideaList.forEach(function(idea) {
      prependExistingIdeas(idea);
    });
  } else {
  }
}

function prependExistingIdeas(idea) {
  $('.article-container').prepend(`<article id='${idea.id}'>
  <div class="description-container">
  <h2 contentEditable = 'true'>${idea.title}</h2>
  <button class="icons" id="delete-btn"></button>
  <p class="description" contentEditable = 'true'>${idea.body}</p>
  </div>
  <div class="voting-container">
  <button class="icons" id="upvote-btn"></button>
  <button class="icons" id="downvote-btn"></button>
  <p class="quality">quality: <span class="quality-level">${idea.quality}</span></p>
  </div>
  </article>`)
}

function prependNewIdea(titleId, titleInput, bodyInput, newIdea) {
  $('.article-container').prepend(`<article id='${titleId}'>
  <div class="description-container">
  <h2 contentEditable = 'true'>${titleInput}</h2>
  <button class="icons" id="delete-btn"></button>
  <p class="description" contentEditable = 'true'>${bodyInput}</p>
  </div>
  <div class="voting-container">
  <button class="icons" id="upvote-btn"></button>
  <button class="icons" id="downvote-btn"></button>
  <p class="quality">quality: <span class="quality-level">${newIdea.quality}</span></p>
  </div>
  </article>`);
}

function removeIdea(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  ideaList.splice(indexOfOriginalObject, 1);
  localStorage.clear();
  setInLocalStorage();
  $(this).parents('article').remove();
}

function replaceEditedDescription(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.body = $(this).text();
  replaceIdeaInLocalStorage(editedObject);
}

function replaceEditedTitle(e) {
  var editedObject = findIndexIdeaList($(e.target).parent().parent().prop('id'));
  editedObject.title = $(this).text();
  replaceIdeaInLocalStorage(editedObject);
}

function replaceIdeaInLocalStorage(editedObject) {
  localStorage.clear();
  ideaList.splice(indexOfOriginalObject, 1, editedObject);
  setInLocalStorage();
  filterIdeas();
}

function setInLocalStorage() {
  var stringIdeaList = JSON.stringify(ideaList);
  localStorage.setItem('ideas', stringIdeaList);
}

function submitNewIdea(e) {
  e.preventDefault();
  var titleInput = $('#title-input').val();
  var bodyInput = $('#body-input').val();
  var quality = 'swill';
  var titleId = Date.now();
  var newIdea = new ideaObject(titleInput, bodyInput, titleId, quality);
  ideaList.push(newIdea);
  prependNewIdea(titleId, titleInput, bodyInput, newIdea);
  setInLocalStorage();
  clearInputs();
  filterIdeas();
}

function switchDownvote(editedObject) {
  switch (editedObject.quality) {
    case 'genius':
      editedObject.quality = 'plausible'
      $(this).parent().find('.quality-level').text('plausible')
      break;
    case 'plausible':
      editedObject.quality = 'swill'
      $(this).parent().find('.quality-level').text('swill')
      break;
    default:
      break;
  }
}

function switchUpvote(editedObject) {
  switch (editedObject.quality) {
    case 'swill':
      editedObject.quality = 'plausible'
      $(this).parent().find('.quality-level').text('plausible')
      break;
    case 'plausible':
      editedObject.quality = 'genius'
      $(this).parent().find('.quality-level').text('genius')
      break;
    default:
      break;
  }
}

function toggleSaveDisable() {
  var title = $('#title-input').val();
  var body = $('#body-input').val();
  if ((title === '') || (body === '')) {
    $('#submit-btn').prop('disabled', true);
  } else {
    $('#submit-btn').prop('disabled', false);
  }
}
