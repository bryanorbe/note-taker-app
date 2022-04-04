const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

let currentNote = {};


// (C)reate Note
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// (R)ead Notes
const getNotes = () => {
    return $.ajax({
      url: "/api/notes",
      method: "GET",
    });
  };

// (U)pload Note?

// (D)elete Note
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// Take the currentNote and display it
const renderCurrentNote = () => {
  $saveNoteBtn.hide();

  if (currentNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(currentNote.title);
    $noteText.val(currentNote.text);

//If there is no currentNote render blank  
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
const manageNoteSave = function () {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderCurrentNote();
  });
};

// Delete the clicked note
const manageNoteDelete = function (event) {
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  if (currentNote.id === note.id) {
    currentNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderCurrentNote();
  });
};

// Sets the currentNote and displays it
const manageNoteView = function () {
  currentNote = $(this).data();
  renderCurrentNote();
};

// Let user add additional notes
const manageNewNoteView = function () {
  currentNote = {};
  renderCurrentNote();
};

// If blank, hide the save button
const manageRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

// Return jquery with user input from list
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// Render notes from db into sidebar
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", manageNoteSave);
$noteList.on("click", ".list-group-item", manageNoteView);
$newNoteBtn.on("click", manageNewNoteView);
$noteList.on("click", ".delete-note", manageNoteDelete);
$noteTitle.on("keyup", manageRenderSaveBtn);
$noteText.on("keyup", manageRenderSaveBtn);

getAndRenderNotes();