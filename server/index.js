'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
var router = express.Router();

const PORT = process.env.PORT || 9000;

mongoose.connect('mongodb://<login>:<pw>@ds123312.mlab.com:23312/rapid-todo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){

});
var noteSchema = mongoose.Schema({
	name: String,
	content: String,
	isDone: false
});
var Note = mongoose.model('Note', noteSchema);



/*
LOG HTTP Requests
*/
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

/*
Serving static assets build from running 'npm run build'
*/
app.use(express.static(path.resolve(__dirname, '..', 'build')));

router.get('/notes', function(req, res){
	res.json({ message: 'API Initialized'});
});

router.get('/get/singleNote', function(req, res){
	Note.find({}).exec(function(err, result) {
		if(!err){
			res.json(result);
		} else {

		};
	});
	
});

router.get('/post/note', function(req, res){
	var note_content=req.query.content;
	var Note1 = new Note ({
		name: 'note3',
		content: note_content,
		isDone: false
	});
	Note1.save(function(err) {if(err) console.log('error on save')});
	res.json({'info': 'success'});
});

router.get('/post/updateNoteState', function(req, res){
	var newState=req.query.content;
	var val = (req.query.content === "true");
	var id=req.query.id;
	console.log('NEW STATE' + val);
	console.log('TYPE OF' + typeof val);
	console.log('id ' + id);
	Note.findByIdAndUpdate(id, {isDone:val}, function(err, result){
		if(err){
			console.log(err);
		}
		//console.log("RESULT: " + result);
	});
	res.json({'info': 'success'});
});

// router.post('/post/newNote', function(req, res){
// 	//var content=req.body.content;
// 	console.log(req.body);
// 	console.log(req.query.content);
// 	res.end('yes');
// })

app.use('/api', router);

/*
Serving based on routes defined in src/routes.js
*/
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});


/*
Listening on defined PORT
*/
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});





// // get the user starlord55
// User.find({ username: 'starlord55' }, function(err, user) {
//   if (err) throw err;

//   // object of the user
//   console.log(user);
// });