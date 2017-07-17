'use strict';

//npm packages
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
var dotenv = require('dotenv');
const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("default-application_5947e9b9e4b023d4b55e2d4b", "d2494848-1781-4a42-b9d3-c378074cc993")

// express variables
const app = express();
var router = express.Router();

// Port to listen on
const PORT = process.env.PORT || 9000;

// load env variables
dotenv.load();

// connect to mongodb
mongoose.connect('mongodb://'+process.env.USERNAME+':'+process.env.PASSWORD+'@ds123312.mlab.com:23312/rapid-todo');
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
//app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

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



/* 
-----------------------------------------------------------------------------------------------------------
	Slack
-----------------------------------------------------------------------------------------------------------
*/

//
// Global variables for slack webhooks command
//
var firstSpace = 0;
var ids = [];

//
// Listen for Slack webhook
//
rapid.listen('Slack', 'slashCommand', { 
	'token': process.env.TOKEN,
	'command': process.env.CMD,
})
.on('join', () => {

})
.on('message', (message) => {
	var channel = message.channel_id;
	var firstSpace = message.text.indexOf(' ');
	var len = message.text.length;
	var text = message.text.substring(firstSpace+1, len);
	parseText(message.text, function(res) {
		//add
		if(res == 1){
			addToDatabase(text).then(res => printNote(channel));
		//remove
		} else if(res == 2){
			getNoteToPrintTwilio();
			var number = parseInt(text) - 1;
			markAsDone(number).then(res => printNote(channel));	
		//print
		} else if(res == 3){
			printNote(channel);
		//add the text
		} else if(res == 4){
			addToDatabase(message.text).then(res => printNote(channel));
		//respond with callback if callback is set to a string
		} else {
			postToChannel(channel, res);
		}
	});
})
.on('error', (error) => {

})
.on('close', (reason) => {

});

function markAsDone(number){
	return new Promise((resolve, reject) => {
		Note.findByIdAndUpdate(ids[number], {isDone:true}, function(err, result){
		    if(err){
		        console.log(err);
		    }
		});
		resolve('sucess');
	});
}

function addToDatabase(text){
	return new Promise((resolve, reject) => {
		var Note1 = new Note ({
			name: 'note1',
			content: text,
			isDone: false
		});
		Note1.save(function(err) {if(err) console.log('error on save')});
		resolve('sucess');
	});
}

/*
prints current todo list to the same channel that the slash command was called

variables:
	channel-name: either channel name or channel id
*/
function printNote(channel_name){
	getNoteToPrintTwilio().then((data) => {
		rapid.call('Slack', 'postMessage', { 
			'token': process.env.TOKEN2,
			'channel': channel_name,
			'text': data,
			'parse': '',
			'linkNames': '',
			'attachments': '',
			'unfurlLinks': '',
			'unfurlMedia': '',
			'username': 'Rapid Todo List',
			'asUser': '',
			'iconUrl': '',
			'iconEmoji': ':raised_hands:'

		}).on('success', (payload)=>{

		}).on('error', (payload)=>{
			console.log(payload);
		});
	});	
}	

function postToChannel(channel_name, payload){
	rapid.call('Slack', 'postMessage', { 
		'token': process.env.TOKEN2,
		'channel': channel_name,
		'text': payload,
		'parse': '',
		'linkNames': '',
		'attachments': '',
		'unfurlLinks': '',
		'unfurlMedia': '',
		'username': 'Rapid Todo List',
		'asUser': '',
		'iconUrl': '',
		'iconEmoji': ':raised_hands:'

	}).on('success', (payload)=>{

	}).on('error', (payload)=>{
		console.log(payload);
	});
}	

/*
  Reads text file to display the current todo list. 
*/
function getNoteToPrintTwilio(){
	var res;

	var ret = '';
	return new Promise((resolve, reject) => {
		Note.find({}).exec(function(err, result) {
			if(!err){
				for(var key in result) {
					ids.push(result[key]._id);
					var number = parseInt(key) + 1;
					if(result[key].isDone){
						ret += '~';
					}
					ret += number + ') ';
	    			ret += result[key].content;
	    			if(result[key].isDone){
		    			ret += '~';
	    			}
	    			ret += '\n';
				}
				resolve(ret);
			} else {
				reject('does not work');
			};
		});
	});
}

/*
parses the slash command to decide what to do

variables
	payload: includes the message to be parsed.
	cb: callback to return information
*/
function parseText(message_text, cb) {
	if(message_text != undefined){
		var firstSpace = message_text.indexOf(' ');
		if(firstSpace == -1) {
			if(message_text.toLowerCase() == 'print'){
				cb(3);
			} else if(message_text.toLowerCase() == 'remove'){
				cb('Usage: /todo remove [number]');
			} else {
				cb(4);
			}
		} else {
			if(message_text.substring(0,firstSpace).toLowerCase() == 'remove'){
				cb(2);
			} else if(message_text.substring(0,firstSpace).toLowerCase() == 'print'){
				cb(3);
			} else {
				cb(4);
			}
		}	
	}
}




/* 
----------------------------------------------------------------------------------------
	Twilio
----------------------------------------------------------------------------------------
*/


/*
	listen for inbound text messages from Twilio
*/
rapid.listen('Twilio', 'webhookEvent', { 

})
.on('join', () => {

})
.on('message', (message) => {
	var text = message.Body;
	var firstSpace = text.indexOf(' ');
	var len = text.length;
	var text = text.substring(firstSpace+1, len);
	console.log(message);
	parseText(message.Body, function(res) {
		if(res == 1){
			addToDatabase(text).then(res => {
				getNoteToPrintTwilio().then((data) => {
					sendListAsText(data);
				});
			});
		} else if(res == 2){
			var number = parseInt(text) - 1;
			markAsDone(number).then(res => {
				getNoteToPrintTwilio().then((data) => {
					sendListAsText(data);
				});
			});
		} else if(res == 3){
			//sendListAsText(getNoteToPrintTwilio());
			getNoteToPrintTwilio().then((data) => {
				sendListAsText(data);
			});
		} else if(res == 4){
			addToDatabase(message.Body).then(res => {
				getNoteToPrintTwilio().then((data) => {
					sendListAsText(data);
				});
			});
		} else {
			console.log('ELSE' + text);
			//postToChannel(channel, res);
		}
	});
})
.on('error', (error) => {

})
.on('close', (reason) => {

});

/*
	send the todo list to the number
*/
function sendListAsText(text){
	rapid.call('Twilio', 'sendSms', { 
		'accountSid': process.env.TWILIOSID,
		'accountToken': process.env.TWILIOTOKEN,
		'from': process.env.PHONE,
		'to': process.env.MYPHONE,
		'body': text

	}).on('success', (payload)=>{
		 /*YOUR CODE GOES HERE*/ 
	}).on('error', (payload)=>{
		 /*YOUR CODE GOES HERE*/ 
	});
}

/*
	get the list from the DB
*/
function getNoteToPrintTwilio(){
	var res;
	var ret = '';
	return new Promise((resolve, reject) => {
		Note.find({}).exec(function(err, result) {
			if(!err){
				for(var key in result) {
					ids.push(result[key]._id);
					var number = parseInt(key) + 1;
					if(result[key].isDone){
						ret += '☑️';
					} else {
						ret += '🔲'
					}
					ret += number + ') ';
	    			ret += result[key].content;
	    			ret += '\n';
				}
				resolve(ret);
			} else {
				reject('does not work');
			};
		});
	});
}

