import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';

const spotifyApi = new SpotifyWebApi();

class PlaylistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { playlist: '' };
    }

    componentDidMount() {
        spotifyApi.getPlaylist(this.props.playlistId, {}, (error, playlist) => {
            if (error) {
                this.props.error(error);
            }
            this.setState({
                playlist: playlist
            });
        });
    }

    render() {
        if (this.state.playlist === '') {
            return null;
        }
        return <div className="contentContainer">
            <ContentHeader title={this.state.playlist.name} images={this.state.playlist.images} contentType='playlist' />
        </div>
    }
}

export default PlaylistPage;