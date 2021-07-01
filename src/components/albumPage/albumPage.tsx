import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
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
    return null;
}

export default withRouter(AlbumPage);