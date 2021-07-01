import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import { RouteComponentProps, withRouter } from "react-router-dom";

const spotifyApi = new SpotifyWebApi();

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
    error: (error: SpotifyWebApi.ErrorObject) => void
    imageLoaded: (imageUrl: string) => void
}

function TrackPage(props: Props) {
    const [track, setTrack] = useState<SpotifyApi.SingleTrackResponse>();


    useEffect(() => {
        spotifyApi.getTrack(props.match.params.id, {}, (error, track) => {
            if (error) {
                props.error(error);
            }
            setTrack(track);
            props.imageLoaded(track.album.images[0].url);
        });
    }, [props]);

    if (track === undefined) {
        return null;
    }
    return <div className="contentContainer">
        <ContentHeader
            title={track.name} imageUrl={track.album.images[0].url} contentType='Track'
        />
    </div>;
}

export default withRouter(TrackPage);