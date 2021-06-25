import './header.css';
import React from 'react';
import AccountLabel from '../accountLabel/accountLabel';

class Header extends React.Component {
    render() {
        return <div id="header">
            <div id="logoText" className="item">BeatDive for Spotify</div>
            <div>load current:</div>
            <button className='headerButton item' onClick={this.props.loadSong} >song</button>
            <button className='headerButton item' onClick={this.props.loadAlbum} >album</button>
            <button className='headerButton item' onClick={this.props.loadArtist} >artist</button>
            <button className='headerButton item' onClick={this.props.loadPlaylist} >playlist</button>
            <AccountLabel authorize={this.props.authorize} loadUser={this.props.loadUser} error={this.props.error} />
        </div>;
    }
}

export default Header;