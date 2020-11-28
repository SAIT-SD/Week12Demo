var notesApp = notesApp || {}  // namespace to prevent global variables

notesApp.selectedNote = 0  // keeps track of which note we are editing

notesApp.getAll = async () => {
    const response = await fetch('http://localhost:8084/notes?action=getAll')
    const notes = await response.json()
    console.log(notes)
    
    // clear out all existing li elements
    const ul = document.querySelector("#notes")
    while (ul.firstChild)
        ul.removeChild(ul.firstChild)
    
    // loop through all notes and create list items with links and append to ul element
    for(let note of notes) {
        let li = document.createElement('li');
        li.innerHTML = note.title
        li.addEventListener('click', () => notesApp.get(note.noteId))
        document.querySelector("#notes").appendChild(li)
    }
}

notesApp.get = async (noteId) => {
    const response = await fetch('http://localhost:8084/notes?action=get&noteId=' + noteId)
    const note = await response.json()
    document.querySelector("#title").value = note.title
    document.querySelector("#contents").value = note.contents
    notesApp.selectedNoteId = note.noteId
    document.querySelector('#saveHeading').innerHTML = 'Edit Note'
}

notesApp.save = async (e, form) => {
    e.preventDefault()  // prevent the usual form submission that the browser does
    let formData = new URLSearchParams()
    if (notesApp.selectedNoteId === 0) {
        formData.append('action', 'create')
    } else {
        formData.append('action', 'update')
        formData.append('noteId', notesApp.selectedNoteId)
    }
    formData.append('title', document.querySelector("#title").value)
    formData.append('contents', document.querySelector('#contents').value)
    
    const response = await fetch(form.action, {
        body: formData,
        method: 'post'
    })
    
    alert('Note saved.')
    
    notesApp.clearNote()
    notesApp.getAll()
}

notesApp.clearNote = () => {
    document.querySelector('#saveHeading').innerHTML = 'Create a New Note'
    document.querySelector("#title").value = ''
    document.querySelector('#contents').value = ''
    notesApp.selectedNoteId = 0
}

// populate the ul tag when the DOM has been created from the HTML
document.addEventListener("DOMContentLoaded", notesApp.getAll)