import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';

const spotifyApi = new SpotifyWebApi();

interface Props {
    playlistId: string
    error: (error: SpotifyWebApi.ErrorObject) => void
}

interface State {
    playlist?: SpotifyApi.PlaylistObjectFull
}

class PlaylistPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { playlist: undefined };
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
        if (this.state.playlist === undefined) {
            return null;
        }
        return <div className="contentContainer">
            <ContentHeader title={this.state.playlist.name} imageUrl={this.state.playlist.images[0].url} contentType='playlist' />
        </div>;
    }
}

export default PlaylistPage;