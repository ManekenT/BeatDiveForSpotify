'use strict';

const clientId = '003e1f0c81d54149b97761a80f6a7270';
const userScopes = 'user-read-currently-playing';
const authCookie = 'authCode'
var authCode;

var spotifyApi = new SpotifyWebApi();

window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
    processDroppedContent(e.dataTransfer.getData("text"));
}, false);

window.onload = function () {
    // URL Argumente parsen
    var fragmentArgs = parseFragment();
    var queryArgs = parseQuery();

    // Authentifizierung
    if (Cookies.get(authCookie)) {
        // Es ist bereits ein AuthToken aus einer früheren Autorisierung vorhanden
        authCode = Cookies.get(authCookie);
    } else if (fragmentArgs['access_token']) {
        // Es ist der erste Pageload nach der Authentifizierung
        authCode = fragmentArgs['access_token'];
        var expireTime = fragmentArgs['expires_in'];
        var expireTime = new Date(new Date().getTime() + (expireTime - 60) * 1000);
        Cookies.set(authCookie, authCode, {
            expires: expireTime
        });
    }
    if (authCode) {
        // Der User hat einen AuthToken, der vermeintlich noch gültig ist
        console.log(authCode);
        spotifyApi.setAccessToken(authCode);
        spotifyApi.getMe({},
            (error, me) => {
                if (error) {
                    console.log(error);
                    // Token war nicht mehr gültig, alle referenzen entfernen und Login ermöglichen
                    Cookies.remove(authCookie);
                    //authorize();
                } else {
                    // User wurde erfolgreich authentifiziert
                    ReactDOM.render(React.createElement(AccountLabel, {
                        display_name: me.display_name,
                        image_url: me.images[0].url
                    }), document.getElementById('accountLabel'));
                }
            }
        );
    } else {
        // Erster Pageload, Login ermöglichen
        authorize();
    }

    // Content zur ID laden
    var id = queryArgs['id'];
    var type = queryArgs['type'];
    console.log(id);
    console.log(type);
    if (id && type) {
        if (type == 'artist') {
            processArtist(id);
        } else if (type == 'track') {
            processTrack(id);
        } else if (type == 'album') {
            processAlbum(id);
        } else if (type == 'user') {
            processUser(id);
        } else if (type == 'playlist') {
            processPlaylist(id);
        }
    } else {
        // Kein Content vorhanden, default anzeigen
        ReactDOM.render(React.createElement(Default, {}), document.getElementById('contentContainer'));
    }
}

function authorize() {
    window.location.href = "https://accounts.spotify.com/authorize?client_id=" + clientId + "&redirect_uri=" + window.location.origin + "&response_type=token&scope=" + userScopes;
}

function processDroppedContent(droppedContent) {
    var urlPart = droppedContent.slice(0, 25);
    if (urlPart != 'https://open.spotify.com/') {
        console.log('Not a valid spotify url: ' + urlPart);
        return;
    }
    var infoPart = droppedContent.slice(25, droppedContent.length);
    if (infoPart.startsWith('artist')) {
        var artistId = infoPart.slice(7, infoPart.length);
        console.log('Dropped artist id: ' + artistId);
        loadContent(artistId, 'artist');
    } else if (infoPart.startsWith('track')) {
        var trackId = infoPart.slice(6, infoPart.length);
        console.log('Dropped track id: ' + trackId);
        loadContent(trackId, 'track');
    } else if (infoPart.startsWith('album')) {
        var albumId = infoPart.slice(6, infoPart.length);
        console.log('Dropped album id: ' + albumId);
        loadContent(albumId, 'album');
    } else if (infoPart.startsWith('user')) {
        var userId = infoPart.slice(5, infoPart.length);
        console.log('Dropped user id: ' + userId);
        loadContent(userId, 'user');
    } else if (infoPart.startsWith('playlist')) {
        var playlistId = infoPart.slice(9, infoPart.length);
        console.log('Dropped playlist id: ' + playlistId);
        loadContent(playlistId, 'playlist');
    }
}

function processArtist(id) {
    spotifyApi.getArtist(id, {}, (error, artist) => {
        spotifyApi.getArtistTopTracks(id, 'from_token', {}, (error, tracks) => {
            spotifyApi.getRecommendations({
                seed_artists: id
            }, (error, recommendations) => {
                ReactDOM.render(React.createElement(Artist, {
                    name: artist.name,
                    images: artist.images,
                    urls: artist.external_urls,
                    followers: artist.followers.total,
                    genres: artist.genres,
                    popularity: artist.popularity,
                    contentType: 'Artist',
                    tracks: tracks.tracks,
                    recommendations: recommendations.tracks
                }), document.getElementById('contentContainer'));
            });
        });
    });
}

function processTrack(id) {
    spotifyApi.getTrack(id, {}, (error, track) => {
        ReactDOM.render(React.createElement(Track, {
            name: track.name,
            images: track.album.images,
            contentType: 'Track'
        }), document.getElementById('contentContainer'));
    });
}

function processPlaylist(id) {
    spotifyApi.getPlaylist(id, {}, (error, playlist) => {
        ReactDOM.render(React.createElement(Playlist, {
            name: playlist.name,
            images: playlist.images,
            contentType: 'Playlist'
        }), document.getElementById('contentContainer'));
    });
}

function processUser(id) {
    spotifyApi.getUser(id, {}, (error, user) => {
        ReactDOM.render(React.createElement(User, {
            name: user.display_name,
            images: user.images,
            contentType: 'User'
        }), document.getElementById('contentContainer'));
    });
}

function processAlbum(id) {
    spotifyApi.getAlbum(id, {}, (error, album) => {
        ReactDOM.render(React.createElement(Album, {
            name: album.name,
            images: album.images,
            contentType: 'Album'
        }), document.getElementById('contentContainer'));
    });
}

function loadCurrentSong() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (track.item) {
            loadContent(track.item.id, 'track');
        }
    })
}

function loadCurrentAlbum() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (track.item) {
            loadContent(track.item.album.id, 'album');
        }
    })
}

function loadCurrentArtist() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (track.item) {
            loadContent(track.item.artists[0].id, 'artist');
        }
    })
}

function loadCurrentPlaylist() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (track.context && track.context.type == 'playlist') {
            processDroppedContent(track.context.external_urls['spotify']);
        }
    })
}

function loadCurrentUser() {
    spotifyApi.getMe({}, (error, user) => {
        loadContent(user.id, 'user');
    })
}

function loadContent(id, type) {
    window.location.href = window.location.origin + '?id=' + id + '&type=' + type;
}
