import * as util from '../lib/util';
import { Artist, Playlist, Track, Default, User, Album, LoginAppeal, BlockerInfo } from './components'
import Header from './header/header';
import Cookies from 'js-cookie'
import React from 'react';
import ReactDOM from 'react-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';

const spotifyApi = new SpotifyWebApi();
const clientId = '003e1f0c81d54149b97761a80f6a7270';
const userScopes = 'user-read-currently-playing';
const authCookie = 'authCode';
var authCode;
var fragmentArgs;
var queryArgs;



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { type: 'default', id: '' };

        console.log(this.state);

        window.addEventListener("dragover", function (e) {
            e.preventDefault();
        }, false);
        window.addEventListener("drop", function (e) {
            e.preventDefault();
            processDroppedContent(e.dataTransfer.getData("text"));
        }, false);

        // URL Argumente parsen
        fragmentArgs = util.parseFragment();
        queryArgs = util.parseQuery();
        var stateObject;

        if (fragmentArgs['access_token']) {
            // Es ist der erste Pageload nach der Authentifizierung
            authCode = fragmentArgs['access_token'];
            var expireTime = fragmentArgs['expires_in'];
            expireTime = new Date(new Date().getTime() + (expireTime - 60) * 1000);
            Cookies.set(authCookie, authCode, {
                expires: expireTime
            });
            if (fragmentArgs['state']) {
                stateObject = util.parseStateString(fragmentArgs['state']);
                loadContent(stateObject.id, stateObject.type)
            } else {
                window.location.href = window.location.origin
            }
        } else if (queryArgs['error']) {
            // Erster Pageload nach unvollständiger Auth
            return React.createElement(LoginAppeal, { authorize: authorize });
        }


        if (Cookies.get(authCookie)) {
            authCode = Cookies.get(authCookie);
            // Der User hat einen AuthToken, der vermeintlich noch gültig ist
            console.log('Spotify Authentication Code:' + authCode);
            spotifyApi.setAccessToken(authCode);
        } else {
            // Erster Pageload, Login ermöglichen
            //authorize();
        }

        // Content zur ID laden
        if (queryArgs['id'] && queryArgs['type']) {
            this.state.id = queryArgs['id'];
            this.state.type = queryArgs['type'];
        } else if (fragmentArgs['state']) {
            stateObject = util.parseStateString(fragmentArgs['state']);
            this.state.id = stateObject.id;
            this.state.type = stateObject.type;
        }
    }

    componentDidMount() {

    }

    render() {
        console.log(this.state.type);
        var content;
        if (this.state.type === 'default') {
            content = <Default />;
        } else if (this.state.type === 'track') {
            content = <Track id={this.state.id} />
        }
        return <div>
            <Header
                loadSong={loadCurrentSong}
                loadArtist={loadCurrentArtist}
                loadUser={loadCurrentUser}
                loadPlaylist={loadCurrentPlaylist}
                loadAlbum={loadCurrentAlbum}
                authorize={authorize} />
            {content}
        </div>;
    }

}

export default App;

function authorize() {
    var stateString = '';
    if (queryArgs['id'] && queryArgs['type']) {
        stateString = '&state=' + queryArgs['id'] + '_' + queryArgs['type'];
    } else if (queryArgs['state']) {
        stateString = '&state=' + queryArgs['state'];
    }
    window.location.href = "https://accounts.spotify.com/authorize?client_id=" + clientId + "&redirect_uri=" + window.location.origin + "&response_type=token&scope=" + userScopes + stateString;
}

function handleApiError(error) {
    if (error.status === 401) {
        // Auth Code is not valid anymore
        Cookies.remove(authCookie);
        authorize();
    } else if (error.status === 0) {
        // Some plugin is blocking access to the spotify api
        return React.createElement(BlockerInfo, {});
    } else {
        console.error(error);
    }
}

function processDroppedContent(droppedContent) {
    var urlPart = droppedContent.slice(0, 25);
    if (urlPart !== 'https://open.spotify.com/') {
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
    spotifyApi.getArtist(id, {}, (error1, artist) => {
        spotifyApi.getArtistTopTracks(id, 'from_token', {}, (error2, tracks) => {
            spotifyApi.getRecommendations({
                seed_artists: id
            }, (error3, recommendations) => {
                if (error1) {
                    handleApiError(error1);
                } else if (error2) {
                    handleApiError(error2);
                } else if (error3) {
                    handleApiError(error3);
                } else {
                    // TODO related artists
                    return React.createElement(Artist, {
                        name: artist.name,
                        images: artist.images,
                        urls: artist.external_urls,
                        followers: artist.followers.total,
                        genres: artist.genres,
                        popularity: artist.popularity,
                        tracks: tracks.tracks,
                        recommendations: recommendations.tracks
                    });
                }
            });
        });
    });
}

function processPlaylist(id) {
    spotifyApi.getPlaylist(id, {}, (error, playlist) => {
        if (error) {
            handleApiError(error)
            return;
        }
        ReactDOM.render(React.createElement(Playlist, {
            name: playlist.name,
            images: playlist.images,
        }), document.getElementById('contentContainer'));
    });
}

function processUser(id) {
    spotifyApi.getUser(id, {}, (error, user) => {
        if (error) {
            handleApiError(error)
            return;
        }
        return React.createElement(User, {
            name: user.display_name,
            images: user.images,
        });
    });
}

function processAlbum(id) {
    spotifyApi.getAlbum(id, {}, (error1, album) => {
        spotifyApi.getAlbumTracks(id, {
            limit: 50
        }, (error, albumTracks) => {
            var randomSongs = [];
            for (var i = 0; i < 5; i++) {
                randomSongs[i] = albumTracks.items[Math.floor(Math.random() * albumTracks.items.length)].id;
            }
            var songArg = randomSongs.join(",");
            spotifyApi.getRecommendations({
                seed_tracks: songArg
            }, (error2, recommendations) => {
                if (error1) {
                    handleApiError(error1)
                } else if (error2) {
                    handleApiError(error2);
                } else {
                    console.log(albumTracks.items);
                    ReactDOM.render(React.createElement(Album, {
                        name: album.name,
                        images: album.images,
                        genres: album.genres,
                        type: album.album_type,
                        artists: album.artists,
                        markets: album.available_markets,
                        label: album.label,
                        popularity: album.popularity,
                        releaseDate: album.release_date,
                        releaseDatePrecision: album.release_date_precision,
                        tracks: albumTracks.items,
                        recommendations: recommendations.tracks,
                        copyrights: album.copyrights,
                        ids: album.external_ids,
                        urls: album.external_urls
                    }), document.getElementById('contentContainer'));
                }
            })
        });
    });
}

export function loadCurrentSong() {
    console.log('Loading song');
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (error) {
            handleApiError(error)
            return;
        }
        if (track.item) {
            loadContent(track.item.id, 'track');
        }
    })
}

export function loadCurrentAlbum() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (error) {
            handleApiError(error)
            return;
        }
        if (track.item) {
            loadContent(track.item.album.id, 'album');
        }
    })
}

export function loadCurrentArtist() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (error) {
            handleApiError(error)
            return;
        }
        if (track.item) {
            loadContent(track.item.artists[0].id, 'artist');
        }
    })
}

export function loadCurrentPlaylist() {
    spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
        if (error) {
            handleApiError(error)
            return;
        }
        if (track.context && track.context.type === 'playlist') {
            processDroppedContent(track.context.external_urls['spotify']);
        }
    })
}

export function loadCurrentUser() {
    spotifyApi.getMe({}, (error, user) => {
        if (error) {
            handleApiError(error)
            return;
        }
        loadContent(user.id, 'user');
    })
}

function loadContent(id, type) {
    window.location.href = window.location.origin + '?id=' + id + '&type=' + type;
}
