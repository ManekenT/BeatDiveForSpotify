import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const spotifyApi = new SpotifyWebApi();

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
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
        spotifyApi.getPlaylist(this.props.match.params.id, {}, (error, playlist) => {
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

export default withRouter(PlaylistPage);