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

interface Props extends RouteComponentProps {

}

class App extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.handleApiError = this.handleApiError.bind(this);
        this.loadCurrentSong = this.loadCurrentSong.bind(this);
        this.loadCurrentAlbum = this.loadCurrentAlbum.bind(this);
        this.loadCurrentArtist = this.loadCurrentArtist.bind(this);
        this.loadCurrentPlaylist = this.loadCurrentPlaylist.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.authorize = this.authorize.bind(this);
        this.processDroppedContent = this.processDroppedContent.bind(this);

        window.addEventListener('dragover', (e) => {
            e.preventDefault();
        }, false);
        window.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer !== null) {
                this.processDroppedContent(e.dataTransfer.getData('text'));
            }
        }, false);


        let authCode = Cookies.get(authCookie)
        console.log("authCode: " + authCode);
        if (authCode === undefined) {
            //Kein Cookie gefunden => Nachschauen ob es ein hashFragment vom SpotifyLogin gibt
            let { access_token } = parseFragment(this.props.location.hash);
            if (access_token !== undefined) {
                // hashFragment gefunden
                console.log(access_token)
                Cookies.set('authCode', access_token);
                console.log("Cookie should be set to: " + access_token);
                spotifyApi.setAccessToken(access_token);
            } else {
                //Noch keine Anmeldung erfolgt => Weiterleiten auf Spotify Auth Seite
                this.authorize();
            }
        } else {
            console.log('Logged in!');
            spotifyApi.setAccessToken(authCode);
        }
    }

    render() {

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
                        It doesn&apost really make sense without access to the Spotify Api.
                    </TextOverlay>
                    <button onClick={this.authorize}>authorize</button>
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

    loadCurrentSong() {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                this.handleApiError(error);
                return;
            }
            if (track.item) {
                this.loadContent(track.item.id, 'track');
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
                this.loadContent(track.item.album.id, 'album');
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
                this.loadContent(track.item.artists[0].id, 'artist');
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
                console.log("PLAYLIST");
                this.processDroppedContent(track.context.external_urls['spotify']);
            }
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

    processDroppedContent(droppedContent: string) {
        const urlPart = droppedContent.slice(0, 25);
        if (urlPart !== 'https://open.spotify.com/') {
            console.log('Not a valid spotify url: ' + urlPart);
            return;
        }
        const infoPart = droppedContent.slice(25, droppedContent.length);
        if (infoPart.startsWith('artist')) {
            const artistId = infoPart.slice(7, infoPart.length);
            console.log('Dropped artist id: ' + artistId);
            this.loadContent(artistId, 'artist');
        } else if (infoPart.startsWith('track')) {
            const trackId = infoPart.slice(6, infoPart.length);
            console.log('Dropped track id: ' + trackId);
            this.loadContent(trackId, 'track');
        } else if (infoPart.startsWith('album')) {
            const albumId = infoPart.slice(6, infoPart.length);
            console.log('Dropped album id: ' + albumId);
            this.loadContent(albumId, 'album');
        } else if (infoPart.startsWith('user')) {
            const userId = infoPart.slice(5, infoPart.length);
            console.log('Dropped user id: ' + userId);
            this.loadContent(userId, 'user');
        } else if (infoPart.startsWith('playlist')) {
            const playlistId = infoPart.slice(9, infoPart.length);
            console.log('Dropped playlist id: ' + playlistId);
            this.loadContent(playlistId, 'playlist');
        }
    }

    loadContent(id: string, type: string) {
        this.props.history.push("/" + type + "/" + id)
    }

    authorize() {
        window.location.href = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.origin + '&response_type=token&scope=' + userScopes;
    }
}

export default withRouter(App);
