//===============Require Calls=============//

require('dotenv').config();
var keys = require('./keys')
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var inquirer = require('inquirer');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//===============Input Types=============//

var typeExecution = process.argv[2];
var tweets = 'my-tweets';
var song = 'spotify-this-song';
var movie = 'movie-this'

//===============Song and Movie Variables=============//
var movieTitle = '';
var songTitle = '';

//===============Handler for Terminal Input=============//
switch (typeExecution) {
	case tweets:
		myTweets();
		break;
	case song:
		spotifySong();
		break;
	case movie:
		getMovie();
		break;
	default:
		initInquirer();
}



//===============Functions=============//

function log(item) {
	console.log(item);
}

function myTweets() {
	client.get('statuses/user_timeline', {screen_name: 'JoshUMCode'}, function(error, tweets, response){
		if (error){
			log(error.message)
		}
		var len = tweets.length
		if (len > 19){
			for (var i = 0; i < 20; i++){
				log(tweets[i].created_at, tweets[i].text);
			}	
		} else {
			for ( var i = 0; i < len; i++){
				log(tweets[i].created_at, tweets[i].text);
			}
		}
	});
}

function spotifySong() {
	// Refer to console input to extract the song title and store it into
	// songTitle variable.
	var len = process.argv.length

	if (len > 3) {
		for (var i = 3; i < len; i++){
			if (i === 3) {
				songTitle = process.argv[i];

			} else if (i < len) {
				songTitle = songTitle + ' ' + process.argv[i];

			} 
		}
	} else if (songTitle === '') {
		log('Please add a song title.');
	}
	
	spotify.search({ type: 'track', query: songTitle })
		.then(function(response) {

			var artist = 'Artist: ' + response.tracks.items[0].album.artists[0].name;
			var preview = 'Preview URL: ' + response.tracks.items[0].preview_url
			var songName = 'Song Name: ' + response.tracks.items[0].name;
			var album = 'Album Name: ' + response.tracks.items[0].album.name;
	
			log('\n');
			log(artist);
			log(preview);
			log(songName);
			log(album);
			log('\n');
		})
		.catch(function(err) {
			log(err);
		});
}

function getMovie() {
	// Refer to console input to extract the song title and store it into
	// movieTitle variable.
	var len = process.argv.length
	// Make sure a movie is added
	if (len > 3) {
		for (var i = 3; i < len; i++){
			if (i < len && movieTitle !== ''){
				movieTitle = movieTitle; + '+' + process.argv[i].toLowerCase();
			} else {
				movieTitle = process.argv[i].toLowerCase();
			}
		}
	} else if (movieTitle === '') {
		log('Please add a movie title.');
	}	
	// Log to make sure functioning.
	// log(movieTitle);

	var queryURL = 'http://www.omdbapi.com/?apikey=395b87e4&t='	+ movieTitle;
	request(queryURL, function(error, response, body){

		movieObj = JSON.parse(body);
		// * Title of the movie.
		// * Year the movie came out.
		// * IMDB Rating of the movie.
		// * Rotten Tomatoes Rating of the movie.
		// * Country where the movie was produced.
		// * Language of the movie.
		// * Plot of the movie.
		// * Actors in the movie.
		log("* Title: " + movieObj.Title);
		log("* Year Released: " + movieObj.Year);
		log("* IMDB rating: " + movieObj.Ratings[0].Value);
		log("* Rotten Tomatoes rating: " + movieObj.Ratings[1].Value);
		log("* Country: " + movieObj.Country);
		log("* Language: " + movieObj.Language);
		log("\n* Plot: " + movieObj.Plot + "\n");
		log("* Actors: " + movieObj.Actors);
	})

}

function initInquirer() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Please select what you want to do?',
			choices: ['my-tweets', 'spotify-this-song', 'movie-this'],
			name: 'selection'
		}
		]).then(function(response){

			switch (response.selection) {
				case tweets:
					myTweets();
					break;
				case song:
					inquireSong();
					break;
				case movie:
					inquireMovie();
				break;

			}
		})
}

function inquireSong() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Tell me the song you want:',
			name: 'songTitle'
		}
		]).then(function(response){
			songTitle = response.songTitle;
			spotifySong();
		})
}

function inquireMovie() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Tell me the movie you want:',
			name: 'movieTitle'
		}
		]).then(function(response){
			titleList =response.movieTitle.split(' ');
			var len = titleList.length;
			for (var i = 0; i < len; i++){
				if (i === 0){
					movieTitle += titleList[i].toLowerCase();
				} else {
					movieTitle = movieTitle + '+' + titleList[i].toLowerCase();	
				}
			}
			getMovie();
	});
}