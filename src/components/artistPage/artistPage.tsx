import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import GenreCollection from '../../container/genreCollection/genreCollection';
import ArtistPopularity from '../../container/artistPopularity/artistPopularity';
import TrackCollection from '../../container/trackCollection/trackCollection';
import LinkCollection from '../../container/linkCollection/linkCollection';
import Tracklist from '../../container/tracklist/tracklist';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const spotifyApi = new SpotifyWebApi();

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
    error: (error: SpotifyWebApi.ErrorObject) => void
}

interface State {
    artist?: SpotifyApi.ArtistObjectFull
    recommendations?: SpotifyApi.RecommendationsObject
    tracks?: SpotifyApi.TrackObjectFull[]
}

class ArtistPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { artist: undefined, recommendations: undefined, tracks: undefined };
    }

    componentDidMount(): void {
        spotifyApi.getArtist(this.props.match.params.id, {}, (error1, artist) => {
            spotifyApi.getArtistTopTracks(this.props.match.params.id, 'from_token', {}, (error2, tracks) => {
                spotifyApi.getRecommendations({
                    seed_artists: this.props.match.params.id,
                    limit: 5
                }, (error3, recommendations) => {
                    if (error1) {
                        this.props.error(error1);
                    } else if (error2) {
                        this.props.error(error2);
                    } else if (error3) {
                        this.props.error(error3);
                    } else {
                        this.setState({
                            artist: artist,
                            recommendations: recommendations,
                            tracks: tracks.tracks
                        });
                        // TODO related artists
                    }
                });
            });
        });
    }

    render() {
        if (this.state.artist === undefined || this.state.recommendations === undefined || this.state.tracks === undefined) {
            return null;
        }
        const artist = this.state.artist;
        const recommendations = this.state.recommendations;
        const tracks = this.state.tracks;
        return <div className="contentContainer">
            <ContentHeader title={artist.name} imageUrl={artist.images[0].url} contentType='artist' />
            <GenreCollection genres={artist.genres} />
            <ArtistPopularity popularity={artist.popularity} followers={artist.followers.total} />
            <div className="seperator" />
            <h2>top tracks</h2>
            <Tracklist tracks={tracks} />
            <div className="seperator" />
            <h2>spotify recommendations</h2>
            <TrackCollection tracks={recommendations.tracks} />
            <div className="seperator" />
            <h2>artist links</h2>
            <LinkCollection urls={artist.external_urls} />
            <div className="seperator" />
        </div>;
    }
}

export default withRouter(ArtistPage);