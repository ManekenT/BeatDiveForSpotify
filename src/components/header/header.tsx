import SpotifyWebApi from 'spotify-web-api-js';
import './header.css';
import AccountLabel from './accountLabel/accountLabel';

interface Props {
    loadSong: () => void
    loadAlbum: () => void
    loadArtist: () => void
    loadPlaylist: () => void
    loadUser: () => void
    authorize: () => void
    error: (error: SpotifyWebApi.ErrorObject) => void
}

export function Header(props: Props) {
    return <div className="font-serif p-2 space-y-2 flex items-center flex-col text-md sm:p-3 sm:text-3xl sm:space-y-4 xl:flex-row xl:space-y-0">
        <div className="text-5xl font-semibold flex-grow sm:text-6xl ml-2">BeatDive</div>
        <div className='flex items-center space-x-1 sm:space-x-4'>
            <button className='headerButton' onClick={props.loadSong} >song</button>
            <button className='headerButton' onClick={props.loadAlbum} >album</button>
            <button className='headerButton' onClick={props.loadArtist} >artist</button>
            <button className='headerButton' onClick={props.loadPlaylist} >playlist</button>
            <AccountLabel authorize={props.authorize} loadUser={props.loadUser} error={props.error} />
        </div>
    </div>;
}
