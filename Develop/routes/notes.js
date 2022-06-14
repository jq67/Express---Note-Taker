// have to setup getnotes, savenote, deletenote routes
// /api/notes, /api/notes, /api/notes/:id
// 
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const uuid = require('../helpers/uuid');
const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// GET Route for feedback page
// notes.get('/notes', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/notes.html'))
// );

notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data => res.json(JSON.parse(data))))
})

notes.post('/', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
      const newNote = {
          title,
          text,
          id: uuidv4(),  
      };
      console.log(newNote)

      readAndAppend(newNote, './db/db.json')

      const response = {
        status: 'success',
        body: newNote,
      };

      res.json(response);
  } else {
    res.json('Error')
  }
})

// delete note

notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
          const result = json.filter((note) => note.id !== noteId);

          writeToFile('./db/db.json', result)

          res.json(`Item ${noteId} has been deleted`)
      })
})

module.exports = notes