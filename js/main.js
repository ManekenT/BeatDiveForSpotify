'use strict';

const client_id = '003e1f0c81d54149b97761a80f6a7270';
const redirect_uri = 'http://' + window.location.hostname + ':' + window.location.port + '/';

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
    var args = parseFragment();

    if (Cookies.get(authCookie)) {
        // Es ist bereits ein AuthToken aus einer früheren Autorisierung vorhanden
        authCode = Cookies.get(authCookie);
    } else if (args['access_token']) {
        // Es ist der erste Pageload nach der Authentifizierung
        authCode = args['access_token'];
        var expireTime = args['expires_in'];
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
                    // Token war nicht mehr gültig, alle referenzen entfernen und Login ermöglichen
                    Cookies.remove(authCookie);
                    window.location.href = redirect_uri;
                } else {
                    // User wurde erfolgreich authentifiziert
                    ReactDOM.render(React.createElement(AccountLabel, {
                        display_name: me.display_name,
                        image_url: me.images[0].url
                    }), document.getElementById('loginButtonContainer'));
                }
            }
        );
    } else {
        // Erster Pageload, Login ermöglichen
        ReactDOM.render(React.createElement(LoginButton, {
            onClick: () => { window.location.href = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=token"; }
        }), document.getElementById('loginButtonContainer'));
    }

    // Default Content laden
    ReactDOM.render(React.createElement(Default, {}), document.getElementById('contentContainer'));
}

function processDroppedContent(droppedContent) {
    var urlPart = droppedContent.slice(0, 25);
    if(urlPart != 'https://open.spotify.com/') {
        console.log('Not a valid spotify url: ' + urlPart);
        return;
    }
    var infoPart = droppedContent.slice(25, droppedContent.length);
    if(infoPart.startsWith('artist')) {
        var artistId = infoPart.slice(7, infoPart.length);
        console.log('Dropped artist id: ' + artistId);
        processArtist(artistId);
    } else if(infoPart.startsWith('track')) {
        var trackId = infoPart.slice(6, infoPart.length);
        console.log('Dropped track id: ' + trackId);
        processTrack(trackId);
    } else if(infoPart.startsWith('album')) {
        var albumId = infoPart.slice(6, infoPart.length);
        console.log('Dropped album id: ' + albumId);
        processAlbum(albumId);
    } else if(infoPart.startsWith('user')) {
        var userId = infoPart.slice(5, infoPart.length);
        console.log('Dropped user id: ' + userId);
        processUser(userId);
    } else if(infoPart.startsWith('playlist')) {
        var playlistId = infoPart.slice(9, infoPart.length);
        console.log('Dropped playlist id: ' + playlistId);
        processPlaylist(playlistId);
    }
}

function processArtist(id) {
    spotifyApi.getArtist(id, {}, (error, artist) => {
        ReactDOM.render(React.createElement(Artist, {
            name: artist.name,
            images: artist.images,
            external_urls: artist.external_urls,
            followers: artist.followers.total,
            genres: artist.genres,
            popularity: artist.popularity,
            contentType: 'Artist'
        }), document.getElementById('contentContainer'));
    });
    // track recommendation for artist
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
