import React from 'react';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-js';
import * as util from '../lib/util';
import './App.css';
import Header from './header/header';
import TrackPage from './trackPage/trackPage';
import AlbumPage from './albumPage/albumPage';
import PlaylistPage from './playlistPage/playlistPage';
import ArtistPage from './artistPage/artistPage';
import UserPage from './userPage/userPage';
import TextContainer from '../container/textContainer/textContainer';
import TextOverlay from '../container/textOverlay/textOverlay';
import MarkedText from '../container/markedText/markedText';

const spotifyApi = new SpotifyWebApi();
const clientId = '003e1f0c81d54149b97761a80f6a7270';
const userScopes = 'user-read-currently-playing';
const authCookie = 'authCode';
var authCode = null;
var fragmentArgs;
var queryArgs: any;

interface Props {

}

interface State {
    type: string
    id: string
}

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { type: 'default', id: '' };
        this.handleApiError = this.handleApiError.bind(this);
        this.loadCurrentSong = this.loadCurrentSong.bind(this);
        this.loadCurrentAlbum = this.loadCurrentAlbum.bind(this);
        this.loadCurrentArtist = this.loadCurrentArtist.bind(this);
        this.loadCurrentPlaylist = this.loadCurrentPlaylist.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.authorize = this.authorize.bind(this);

        window.addEventListener('dragover', function (e) {
            e.preventDefault();
        }, false);
        window.addEventListener('drop', function (e) {
            e.preventDefault();
            if (e.dataTransfer !== null) {
                processDroppedContent(e.dataTransfer.getData('text'));
            }
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
                loadContent(stateObject.id, stateObject.type);
            } else {
                window.location.href = window.location.origin;
            }
        } else if (queryArgs['error']) {
            // Erster Pageload nach unvollständiger Auth
            this.setState({
                type: 'loginAppeal'
            });
        }


        if (Cookies.get(authCookie)) {
            authCode = Cookies.get(authCookie);
            if (authCode === undefined) {
                authCode = null;
            }
            // Der User hat einen AuthToken, der vermeintlich noch gültig ist
            console.log('Spotify Authentication Code:' + authCode);
            spotifyApi.setAccessToken(authCode);
        }

        console.log(queryArgs['id']);
        console.log(queryArgs['id'] !== '');
        // Content zur ID laden
        if (queryArgs['id'] !== '') {
            console.log("setting state");
            this.state = {
                id: queryArgs['id'],
                type: queryArgs['type']
            }
        } else if (fragmentArgs['state']) {
            stateObject = util.parseStateString(fragmentArgs['state']);
            this.state = {
                id: stateObject.id,
                type: stateObject.type
            };
        }
    }

    render() {
        console.log("ID: " + this.state.id);
        console.log(this.state);
        var content;
        if (this.state.type === 'default') {
            content = <TextContainer>
                Drag and drop a Spotify link over here. Artist, user, song, playlist or album!
            </TextContainer>;
        } else if (this.state.type === 'authError') {
            content = <TextOverlay>
                Something is blocking requests to the spotify api.
                Please allow this site to access to <MarkedText>api.spotify.com</MarkedText> and refresh the page.
                Thanks!
            </TextOverlay>;
        } else if (this.state.type === 'loginAppeal') {
            content = <TextOverlay>
                Please authorize this site with spotify.
                It doesn&apost really make sense without access to the Spotify Api.
            </TextOverlay>;
        } else if (this.state.type === 'track') {
            content = <TrackPage trackId={this.state.id} error={this.handleApiError} />;
        } else if (this.state.type === 'album') {
            content = <AlbumPage albumId={this.state.id} error={this.handleApiError} />;
        } else if (this.state.type === 'user') {
            content = <UserPage userId={this.state.id} error={this.handleApiError} />;
        } else if (this.state.type === 'playlist') {
            content = <PlaylistPage playlistId={this.state.id} error={this.handleApiError} />;
        } else if (this.state.type === 'artist') {
            content = <ArtistPage artistId={this.state.id} error={this.handleApiError} />;
        }
        return <div>
            <Header
                loadSong={this.loadCurrentSong}
                loadArtist={this.loadCurrentArtist}
                loadUser={this.loadCurrentUser}
                loadPlaylist={this.loadCurrentPlaylist}
                loadAlbum={this.loadCurrentAlbum}
                authorize={this.authorize}
                error={this.handleApiError}
            />
            {content}
        </div>;
    }

    loadCurrentSong() {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            if (track.item) {
                loadContent(track.item.id, 'track');
            }
        });
    }

    loadCurrentAlbum() {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            if (track.item) {
                loadContent(track.item.album.id, 'album');
            }
        });
    }

    loadCurrentArtist() {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            if (track.item) {
                loadContent(track.item.artists[0].id, 'artist');
            }
        });
    }

    loadCurrentPlaylist() {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            if (track.context && track.context.type === 'playlist' && track.context.external_urls) {
                processDroppedContent(track.context.external_urls['spotify']);
            }
        });
    }

    loadCurrentUser() {
        spotifyApi.getMe({}, (error, user) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            loadContent(user.id, 'user');
        });
    }

    handleApiError(error: SpotifyWebApi.ErrorObject) {
        console.error(error);
        if (error.status === 401) {
            // Auth Code is not valid anymore
            Cookies.remove(authCookie);
            this.authorize();
        } else if (error.status === 0) {
            this.setState({
                type: 'authError'
            });
        }
    }

    authorize() {
        var stateString = '';
        if (queryArgs['id'] && queryArgs['type']) {
            stateString = '&state=' + queryArgs['id'] + '_' + queryArgs['type'];
        } else if (queryArgs['state']) {
            stateString = '&state=' + queryArgs['state'];
        }
        window.location.href = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.origin + '&response_type=token&scope=' + userScopes + stateString;
    }
}

export default App;





function processDroppedContent(droppedContent: string) {
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

function loadContent(id: string, type: string) {
    window.location.href = window.location.origin + '?id=' + id + '&type=' + type;
}
