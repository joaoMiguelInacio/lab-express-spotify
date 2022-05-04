require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    
// Our routes go here:
app.get('/', (request, response) => {
  try {  
    response.render('index');
  } catch (err) {
    console.log(err);
  }
});

app.get('/artist-search', async (request, response) => {
  try {
    const data = await spotifyApi.searchArtists(request.query.artist);
    const artistsData = data.body.artists.items;
    const searchedArtist = request.query.artist;
    response.render('artist-search', {artistsData, searchedArtist});
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

app.get('/albums/:id', async (request, response) => {
  try {
    const data = await spotifyApi.getArtistAlbums(request.params.id);
    const albums = data.body.items;
    const author = albums[0].artists[0].name;
    response.render('albums-collection', {albums, author});
  } catch (err) {
    console.log(err);
  }
});

app.get('/tracks/:id', async (request, response) => {
  try {
    const data = await spotifyApi.getAlbumTracks(request.params.id);
    const tracks = data.body.items;
    const data1 = await spotifyApi.getAlbum(request.params.id);
    const albumName = data1.body.name;
    response.render('tracks-collection', {tracks, albumName});
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
