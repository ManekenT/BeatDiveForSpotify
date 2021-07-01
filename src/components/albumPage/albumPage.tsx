import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
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
    imageLoaded: (imageUrl: string) => void
}

function AlbumPage(props: Props) {

    const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse>();
    const [recommendations, setRecommendations] = useState<SpotifyApi.RecommendationsObject>();

    useEffect(() => {
        spotifyApi.getAlbum(props.match.params.id, {}, (error1, album) => {
            if (error1) {
                props.error(error1);
                return;
            }
            spotifyApi.getAlbumTracks(props.match.params.id, {
                limit: 50
            }, (error2, albumTracks) => {
                if (error2) {
                    props.error(error2);
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
                        props.error(error3);
                        return;
                    }
                    props.imageLoaded(album.images[0].url);
                    setAlbum(album);
                    setRecommendations(recommendations);
                });
            });
        });
    }, [props]);

    if (album === undefined || recommendations === undefined) {
        return null;
    }
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

export default withRouter(AlbumPage);