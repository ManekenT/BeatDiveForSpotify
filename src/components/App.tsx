import React from 'react';
import Cookies from 'js-cookie';
import SpotifyWebApi from 'spotify-web-api-js';
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
import { Switch, Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { parseFragment } from '../lib/util';

const spotifyApi = new SpotifyWebApi();
const clientId = '003e1f0c81d54149b97761a80f6a7270';
const userScopes = 'user-read-currently-playing';
const authCookie = 'authCode';

class App extends React.Component<RouteComponentProps> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.handleApiError = this.handleApiError.bind(this);
        this.loadCurrentSong = this.loadCurrentSong.bind(this);
        this.loadCurrentAlbum = this.loadCurrentAlbum.bind(this);
        this.loadCurrentArtist = this.loadCurrentArtist.bind(this);
        this.loadCurrentPlaylist = this.loadCurrentPlaylist.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.authorize = this.authorize.bind(this);
        this.processDroppedContent = this.processDroppedContent.bind(this);
        this.processUrl = this.processUrl.bind(this);

        let authCode = Cookies.get(authCookie)
        console.log("Found cookie: " + authCode);

        //Nach Cookie schauen
        if (authCode !== undefined) {
            spotifyApi.setAccessToken(authCode);
            return;
        }

        //Kein Cookie gefunden => Nachschauen ob es ein hashFragment vom SpotifyLogin gibt
        let { access_token, state } = parseFragment(this.props.location.hash);
        console.log(parseFragment(this.props.location.hash));
        if (access_token !== undefined) {
            console.log("Found access token, setting cookie and api token: " + access_token)
            Cookies.set('authCode', access_token);
            spotifyApi.setAccessToken(access_token);
            this.props.history.push(decodeURIComponent(state));
            return;
        }

        //Noch keine Anmeldung erfolgt => Weiterleiten auf Spotify Auth Seite
        console.log("Redirect to spotify authorization from constructor");
        this.authorize();
    }

    render() {

        return <div onDrop={this.processDroppedContent} onDragOver={this.onDragOver}>
            <Header
                loadSong={this.loadCurrentSong}
                loadArtist={this.loadCurrentArtist}
                loadUser={this.loadCurrentUser}
                loadPlaylist={this.loadCurrentPlaylist}
                loadAlbum={this.loadCurrentAlbum}
                authorize={this.authorize}
                error={this.handleApiError}
            />
            <Switch>
                <Route path="/track/:id">
                    <TrackPage error={this.handleApiError} />
                </Route>
                <Route path="/album/:id">
                    <AlbumPage error={this.handleApiError} />
                </Route>
                <Route path="/user/:id">
                    <UserPage error={this.handleApiError} />
                </Route>
                <Route path="/playlist/:id">
                    <PlaylistPage error={this.handleApiError} />
                </Route>
                <Route path="/artist/:id">
                    <ArtistPage error={this.handleApiError} />
                </Route>
                <Route path="/loginAppeal">
                    <TextOverlay>
                        Please authorize this site with spotify.
                        It doesn't really make sense without access to the Spotify Api.
                        <button onClick={this.authorize}>authorize</button>
                    </TextOverlay>
                </Route>
                <Route path="/authError">
                    <TextOverlay>
                        Something is blocking requests to the spotify api.
                        Please allow this site to access to <MarkedText>api.spotify.com</MarkedText> and refresh the page.
                        Thanks!
                    </TextOverlay>
                </Route>
                <Route path="/">
                    <TextContainer>
                        Drag and drop a Spotify link over here. Artist, user, song, playlist or album!
                    </TextContainer>
                </Route>
            </Switch>
        </div>;
    }

    processDroppedContent(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (e.dataTransfer !== null) {
            this.processUrl(e.dataTransfer.getData('text'));
        }
    }

    onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    loadCurrentSong() {
        this.loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.item) {
                this.loadContent(currentlyPlaying.item.id, 'track');
            }
        });
    }

    loadCurrentAlbum() {
        this.loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.item) {
                this.loadContent(currentlyPlaying.item.album.id, 'album');
            }
        });
    }

    loadCurrentArtist() {
        this.loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.item) {
                this.loadContent(currentlyPlaying.item.artists[0].id, 'artist');
            }
        });
    }

    loadCurrentPlaylist() {
        this.loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.context && currentlyPlaying.context.type === 'playlist' && currentlyPlaying.context.external_urls) {
                this.processUrl(currentlyPlaying.context.external_urls['spotify']);
            }
        });
    }

    loadCurrentlyPlaying(callback: (currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse) => void) {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            callback(track);
        });
    }

    loadCurrentUser() {
        spotifyApi.getMe({}, (error, user) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            this.loadContent(user.id, 'user');
        });
    }

    handleApiError(error: SpotifyWebApi.ErrorObject) {
        console.error(error);
        if (error.status === 401) {
            // Auth Code is not valid anymore
            Cookies.remove(authCookie);
            this.authorize();
        } else if (error.status === 0) {
            this.props.history.push('/authError');
        }
    }

    processUrl(url: string) {
        const urlPart = url.slice(0, 25);
        if (urlPart !== 'https://open.spotify.com/') {
            console.log('Not a valid spotify url: ' + urlPart);
            return;
        }
        const infoPart = url.slice(25, url.length);
        let contentInfos = infoPart.split('/');
        this.loadContent(contentInfos[1], contentInfos[0]);
    }

    loadContent(id: string, type: string) {
        this.props.history.push("/" + type + "/" + id)
    }

    authorize() {
        window.location.href = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.origin + '&response_type=token&scope=' + userScopes + '&state=' + encodeURIComponent(window.location.pathname);
    }
}

export default withRouter(App);
