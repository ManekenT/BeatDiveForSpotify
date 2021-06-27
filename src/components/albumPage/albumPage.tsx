import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import Tracklist from '../../container/tracklist/tracklist';
import TrackCollection from '../../container/trackCollection/trackCollection';
import GenreCollection from '../../container/genreCollection/genreCollection';
import AlbumGeneralInfo from '../../container/albumGeneralInfo/albumGeneralInfo';
import AlbumPopularity from '../../container/albumPopularity/albumPopularity';
import LinkCollection from '../../container/linkCollection/linkCollection';
import IdCollection from '../../container/idCollection/idCollection';
import Copyrights from '../../container/copyrights/copyrights';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const spotifyApi = new SpotifyWebApi();

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
    error: (error: SpotifyWebApi.ErrorObject) => void

}

interface State {
    album?: SpotifyApi.SingleAlbumResponse
    recommendations?: SpotifyApi.RecommendationsObject
}


class AlbumPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { album: undefined, recommendations: undefined, };
    }

    componentDidMount() {
        spotifyApi.getAlbum(this.props.match.params.id, {}, (error1, album) => {
            if (error1) {
                this.props.error(error1);
                return;
            }
            spotifyApi.getAlbumTracks(this.props.match.params.id, {
                limit: 50
            }, (error2, albumTracks) => {
                if (error2) {
                    this.props.error(error2);
                    return;
                }
                const randomSongs = [];
                for (let i = 0; i < 5; i++) {
                    randomSongs[i] = albumTracks.items[Math.floor(Math.random() * albumTracks.items.length)].id;
                }
                const songArg = randomSongs.join(',');
                spotifyApi.getRecommendations({
                    seed_tracks: songArg,
                    limit: 5
                }, (error3, recommendations) => {
                    if (error3) {
                        this.props.error(error3);
                        return;
                    }
                    this.setState({
                        album: album,
                        recommendations: recommendations
                    });
                });
            });
        });
    }

    render() {
        if (this.state.album === undefined || this.state.recommendations === undefined) {
            return null;
        }
        const album = this.state.album;
        const recommendations = this.state.recommendations;
        return <div className="contentContainer">
            <ContentHeader title={album.name} imageUrl={album.images[0].url} contentType="album" />
            <AlbumGeneralInfo album={album} />
            <div className="sectionItem">Released {album.release_date} on {album.label}</div>
            <GenreCollection genres={album.genres} />
            <AlbumPopularity popularity={album.popularity} />
            <div className="seperator" />
            <h2>tracks</h2>
            <Tracklist tracks={album.tracks.items} />
            <div className="seperator" />
            <h2>spotify recommendations</h2>
            <TrackCollection tracks={recommendations.tracks} />
            <div className="seperator" />
            <h2>business info</h2>
            <Copyrights copyrights={album.copyrights} />
            <IdCollection ids={album.external_ids} />
            <div className="sectionItem">{album.available_markets}</div>
            <div className="seperator" />
            <h2>artist links</h2>
            <LinkCollection urls={album.external_urls} />
            <div className="seperator" />
        </div>;
    }
}

export default withRouter(AlbumPage);