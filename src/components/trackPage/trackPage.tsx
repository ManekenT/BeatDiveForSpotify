import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';

const spotifyApi = new SpotifyWebApi();

interface Props {
    trackId: string
    error: (error: SpotifyWebApi.ErrorObject) => void
}

interface State {
    track?: SpotifyApi.TrackObjectFull
}

class TrackPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { track: undefined };
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
        if (this.state.track === undefined) {
            return null;
        }
        return <div className="contentContainer">
            <ContentHeader
                title={this.state.track.name} imageUrl={this.state.track.album.images[0].url} contentType='Track'
            />
        </div>;
    }
}

export default TrackPage;