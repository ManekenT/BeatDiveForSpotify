import SpotifyWebApi from 'spotify-web-api-js';
import './header.css';
import React from 'react';
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

class Header extends React.Component<Props> {
    render() {
        return <div className="font-serif m-5 space-y-2 flex items-center flex-col text-xl sm:text-3xl xl:flex-row xl:space-y-0">
            <div className="text-4xl font-semibold flex-grow sm:text-5xl ">BeatDive for Spotify</div>
            <div className='flex items-center space-x-1 sm:space-x-4'>
                <button className='headerButton' onClick={this.props.loadSong} >song</button>
                <button className='headerButton' onClick={this.props.loadAlbum} >album</button>
                <button className='headerButton' onClick={this.props.loadArtist} >artist</button>
                <button className='headerButton' onClick={this.props.loadPlaylist} >playlist</button>
                <AccountLabel authorize={this.props.authorize} loadUser={this.props.loadUser} error={this.props.error} />
            </div>
        </div>;
    }
}

export default Header;