import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';

const spotifyApi = new SpotifyWebApi();

class TrackPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { track: '' };
    }

    componentDidMount() {
        spotifyApi.getTrack(this.props.trackId, {}, (error, track) => {
            if (error) {
                this.props.error(error);
            }
            this.setState({
                track: track
            });
        });
    }

    render() {
        if (this.state.track === '') {
            return null;
        }
        return <div className="contentContainer">
            <ContentHeader
                title={this.state.track.name} images={this.state.track.album.images} contentType='Track'
            />
        </div>;
    }
}

export default TrackPage;