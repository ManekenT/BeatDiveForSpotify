import { AlbumGeneralInfo, AlbumPopularity } from "../components";
import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import Tracklist from "../../container/tracklist/tracklist";
import TrackCollection from "../../container/trackCollection/trackCollection";
import GenreCollection from "../../container/genreCollection/genreCollection";
import { Copyright, Ids, Links } from "../components";

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
                    seed_tracks: songArg
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
        console.log(this.state.recommendations);
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
            <TrackCollection tracks={this.state.recommendations.tracks} />
            <div className="seperator" />
            <h2>business info</h2>
            <Copyright copyrights={album.copyrights} />
            <Ids ids={album.external_ids} />
            <div className="sectionItem">{album.available_markets}</div>
            <div className="seperator" />
            <h2>artist links</h2>
            <Links urls={album.external_urls} />
            <div className="seperator" />
        </div>
    }
    /*     return e(React.Fragment, {},
            e(ContentHeader, {
                title: props.name,
                images: props.images,
                contentType: 'Album'
            }),
            e(AlbumGeneralInfo, {
                type: props.type,
                artists: props.artists
            }),
            e('div', { className: 'sectionItem' }, `Released ${props.releaseDate} on ${props.label}`),
            e(GenreTags, {
                genres: props.genres
            }),
            e(AlbumPopularity, {
                popularity: props.popularity,
                followers: props.followers
            }),
            e('div', { className: 'seperator' }),
            e('h2', {}, 'tracks'),
            e(Tracklist, {
                tracks: props.tracks
            }),
            e('div', { className: 'seperator' }),
            e('h2', {}, 'spotify recommendations'),
            e(TrackCollectionWithImages, {
                tracks: props.recommendations
            }),
            e('div', { className: 'seperator' }),
            e('h2', {}, 'business info'),
            e(Copyright, {
                copyrights: props.copyrights
            }),
            e(Ids, {
                ids: props.ids
            }),
            e('div', { className: 'sectionItem' }, props.markets),
            e('div', { className: 'seperator' }),
            e('h2', {}, 'artist links'),
            e(Links, {
                urls: props.urls
            }),
            e('div', { className: 'seperator' })
        ); */
}

export default AlbumPage;