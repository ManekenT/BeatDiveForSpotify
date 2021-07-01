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

function ArtistPage(props: Props) {

    const [artist, setArtist] = useState<SpotifyApi.ArtistObjectFull>();
    const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>();
    const [recommendations, setRecommendations] = useState<SpotifyApi.RecommendationsObject>();

    useEffect(() => {
        spotifyApi.getArtist(props.match.params.id, {}, (error1, artist) => {
            spotifyApi.getArtistTopTracks(props.match.params.id, 'from_token', {}, (error2, tracks) => {
                spotifyApi.getRecommendations({
                    seed_artists: props.match.params.id,
                    limit: 5
                }, (error3, recommendations) => {
                    if (error1) {
                        props.error(error1);
                    } else if (error2) {
                        props.error(error2);
                    } else if (error3) {
                        props.error(error3);
                    } else {
                        props.imageLoaded(artist.images[0].url);
                        setArtist(artist);
                        setTopTracks(tracks.tracks)
                        setRecommendations(recommendations);
                        // TODO related artists
                    }
                });
            });
        });
    }, [props]);

    if (artist === undefined || recommendations === undefined || topTracks === undefined) {
        return null;
    }
    return null;
}

export default withRouter(ArtistPage);