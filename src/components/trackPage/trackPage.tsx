import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { TitleCard } from './titleCard';
import { MainInfos } from './mainInfos';
import { AudioFeatures } from './audioFeatures';

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
    const [audioFeatures, setAudioFeatures] = useState<SpotifyApi.AudioFeaturesObject>();


    useEffect(() => {
        spotifyApi.getTrack(props.match.params.id, {}, (error, track) => {
            if (error) {
                props.error(error);
            }

            setTrack(track);
            props.imageLoaded(track.album.images[0].url);
        });
    }, [props]);

    useEffect(() => {
        spotifyApi.getAudioFeaturesForTrack(props.match.params.id, (error, audioFeatures) => {
            if (error) {
                props.error(error);
            }
            setAudioFeatures(audioFeatures);
        });
    }, [props]);

    if (track === undefined || audioFeatures === undefined) {
        return null;
    }
    return <div className='flex flex-col items-center mt-12 space-y-16'>
        <TitleCard track={track} />
        <MainInfos track={track} audioFeatures={audioFeatures} />
        <AudioFeatures track={track} audioFeatures={audioFeatures} />
    </div>;
}

export default withRouter(TrackPage);