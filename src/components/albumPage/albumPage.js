import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import Tracklist from "../../container/tracklist/tracklist";
import TrackCollection from "../../container/trackCollection/trackCollection";
import GenreCollection from "../../container/genreCollection/genreCollection";
import AlbumGeneralInfo from "../../container/albumGeneralInfo/albumGeneralInfo";
import AlbumPopularity from '../../container/albumPopularity/albumPopularity';
import LinkCollection from '../../container/linkCollection/linkCollection';
import IdCollection from '../../container/idCollection/idCollection';
import Copyrights from '../../container/copyrights/copyrights';

const spotifyApi = new SpotifyWebApi();

class AlbumPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { album: '', recommendations: '', };
    }

    componentDidMount() {
        spotifyApi.getAlbum(this.props.albumId, {}, (error1, album) => {
            if (error1) {
                this.props.error(error1);
                return;
            }
            spotifyApi.getAlbumTracks(this.props.albumId, {
                limit: 50
            }, (error2, albumTracks) => {
                if (error2) {
                    this.props.error(error2);
                    return;
                }
                var randomSongs = [];
                for (var i = 0; i < 5; i++) {
                    randomSongs[i] = albumTracks.items[Math.floor(Math.random() * albumTracks.items.length)].id;
                }
                var songArg = randomSongs.join(",");
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
        if (this.state.album === '' || this.state.recommendations === '') {
            return null;
        }
        var album = this.state.album;
        var recommendations = this.state.recommendations;
        return <div className="contentContainer">
            <ContentHeader title={album.name} images={album.images} contentType="album" />
            <AlbumGeneralInfo type={album.album_type} artists={album.artists} />
            <div className="sectionItem">Released {album.release_date} on {album.label}</div>
            <GenreCollection genres={album.genres} />
            <AlbumPopularity popularity={album.popularity} followers={album.followers} />
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
        </div>
    }
}

export default AlbumPage;