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
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { parseFragment } from '../lib/util';
import Vibrant from 'node-vibrant';

const spotifyApi = new SpotifyWebApi();
const clientId = '003e1f0c81d54149b97761a80f6a7270';
const userScopes = 'user-read-currently-playing';
const authCookie = 'authCode';

export function App() {

    let history = useHistory();
    let location = useLocation();

    const processDroppedContent = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer !== null) {
            processUrl(e.dataTransfer.getData('text'));
        }
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function loadCurrentSong() {
        loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.item) {
                loadContent(currentlyPlaying.item.id, 'track');
            }
        });
    }

    function loadCurrentAlbum() {
        loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.item) {
                loadContent(currentlyPlaying.item.album.id, 'album');
            }
        });
    }

    function loadCurrentArtist() {
        loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.item) {
                loadContent(currentlyPlaying.item.artists[0].id, 'artist');
            }
        });
    }

    function loadCurrentPlaylist() {
        loadCurrentlyPlaying((currentlyPlaying) => {
            if (currentlyPlaying.context && currentlyPlaying.context.type === 'playlist' && currentlyPlaying.context.external_urls) {
                processUrl(currentlyPlaying.context.external_urls['spotify']);
            }
        });
    }

    function loadCurrentlyPlaying(callback: (currentlyPlaying: SpotifyApi.CurrentlyPlayingResponse) => void) {
        spotifyApi.getMyCurrentPlayingTrack({}, (error, track) => {
            if (error) {
                handleApiError(error);
                return;
            }
            callback(track);
        });
    }

    function loadCurrentUser() {
        spotifyApi.getMe({}, (error, user) => {
            if (error) {
                handleApiError(error);
                return;
            }
            loadContent(user.id, 'user');
        });
    }

    function imageLoaded(imageUrl: string) {
        Vibrant.from(imageUrl).getPalette().then(function (palette: any) {
            let root = document.documentElement;
            let swatch: any;
            let pop: number = 0;
            Object.entries(palette).forEach((entry: any) => {
                if (entry[1].population > pop) {
                    pop = entry[1].population;
                    swatch = entry[1];
                }
            });
            if (swatch) {
                root.style.setProperty('--color-primary', swatch.hex);
                root.style.setProperty('--color-secondary', swatch.hex);
                root.style.setProperty('--color-text', swatch.titleTextColor);
            } else {
                root.style.setProperty('--color-primary', root.style.getPropertyValue('--color-primary-default'));
                root.style.setProperty('--color-secondary', root.style.getPropertyValue('--color-secondary-default'));
                root.style.setProperty('--color-text', root.style.getPropertyValue('--color-text-default'));
            }
        });
    }

    function handleApiError(error: SpotifyWebApi.ErrorObject) {
        console.error(error);
        if (error.status === 401) {
            // Auth Code is not valid anymore
            Cookies.remove(authCookie);
            authorize();
        } else if (error.status === 0) {
            history.push('/authError');
        }
    }

    function processUrl(url: string) {
        const urlPart = url.slice(0, 25);
        if (urlPart !== 'https://open.spotify.com/') {
            console.log('Not a valid spotify url: ' + urlPart);
            return;
        }
        const infoPart = url.slice(25, url.length);
        let contentInfos = infoPart.split('/');
        loadContent(contentInfos[1], contentInfos[0]);
    }

    function loadContent(id: string, type: string) {
        history.push("/" + type + "/" + id)
    }

    function authorize() {
        window.location.href = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&redirect_uri=' + window.location.origin + '&response_type=token&scope=' + userScopes + '&state=' + encodeURIComponent(window.location.pathname);
    }

    let authCode = Cookies.get(authCookie)
    console.log("Found cookie: " + authCode);
    let { access_token, state } = parseFragment(location.hash);
    console.log(parseFragment(location.hash));

    //Nach Cookie schauen
    if (authCode !== undefined) {
        spotifyApi.setAccessToken(authCode);
    } else if (access_token !== undefined) {
        //Kein Cookie gefunden => Nachschauen ob es ein hashFragment vom SpotifyLogin gibt
        console.log("Found access token, setting cookie and api token: " + access_token)
        Cookies.set('authCode', access_token);
        spotifyApi.setAccessToken(access_token);
        history.push(decodeURIComponent(state));
    } else {
        //Noch keine Anmeldung erfolgt => Weiterleiten auf Spotify Auth Seite
        console.log("Redirect to spotify authorization from constructor");
        authorize();
    }

    return <div onDrop={processDroppedContent} onDragOver={onDragOver}>
        <Header
            loadSong={loadCurrentSong}
            loadArtist={loadCurrentArtist}
            loadUser={loadCurrentUser}
            loadPlaylist={loadCurrentPlaylist}
            loadAlbum={loadCurrentAlbum}
            authorize={authorize}
            error={handleApiError}
        />
        <Switch>
            <Route path="/track/:id">
                <TrackPage imageLoaded={imageLoaded} error={handleApiError} />
            </Route>
            <Route path="/album/:id">
                <AlbumPage imageLoaded={imageLoaded} error={handleApiError} />
            </Route>
            <Route path="/user/:id">
                <UserPage imageLoaded={imageLoaded} error={handleApiError} />
            </Route>
            <Route path="/playlist/:id">
                <PlaylistPage imageLoaded={imageLoaded} error={handleApiError} />
            </Route>
            <Route path="/artist/:id">
                <ArtistPage imageLoaded={imageLoaded} error={handleApiError} />
            </Route>
            <Route path="/loginAppeal">
                <TextOverlay>
                    Please authorize this site with spotify.
                    It doesn't really make sense without access to the Spotify Api.
                    <button onClick={authorize}>authorize</button>
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
