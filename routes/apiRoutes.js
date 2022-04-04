var fs = require("fs");
var { v4: uuidv4 } = require('uuid');

function getNotes() {
  const data = fs.readFileSync('./db/db.json', 'utf8');
  return JSON.parse(data);
}
module.exports = function (app) {
  app.get("/api/notes", function (req, res) {
    res.json(getNotes());
  });

  app.post("/api/notes", function (req, res) {
 
    req.body.id = uuidv4();
    const notes = getNotes();
    notes.push(req.body);

    fs.writeFile("./db/db.json", JSON.stringify(notes), "utf8", function (err) {
      if (err) throw err;
      res.json(req.body);
    })

  });
  
  app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);
    const newNotes = getNotes().filter(note => note.id !== req.params.id);
    
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), "utf8", function (err) {
      if (err) throw err;
      res.json({success: true});
    })

  });


};