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

function PlaylistPage(props: Props) {

    const [playlist, setPlaylist] = useState<SpotifyApi.PlaylistObjectFull>();

    useEffect(() => {
        spotifyApi.getPlaylist(props.match.params.id, {}, (error, playlist) => {
            if (error) {
                props.error(error);
            }
            props.imageLoaded(playlist.images[0].url);
            setPlaylist(playlist);
        });

    }, [props]);

    if (playlist === undefined) {
        return null;
    }
    return null;
}

export default withRouter(PlaylistPage);