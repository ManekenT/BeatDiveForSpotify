import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { TitleCard } from './titleCard';
import { MainInfos } from './mainInfos';
import { AudioFeatures } from './audioFeatures';
import TrackCollection from '../../container/trackCollection/trackCollection';
import { Seperator } from '../../container/seperator/seperator';
import IdCollection from '../../container/idCollection/idCollection';
import LinkCollection from '../../container/linkCollection/linkCollection';

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
    const [recommendations, setRecommendations] = useState<SpotifyApi.RecommendationsObject>();


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

    useEffect(() => {
        spotifyApi.getRecommendations({
            seed_tracks: props.match.params.id,
            limit: 5
        }, (error, recommendations) => {
            if (error) {
                props.error(error);
            }
            setRecommendations(recommendations);
        });
    }, [props]);

    if (track === undefined || audioFeatures === undefined || recommendations === undefined) {
        return null;
    }
    return <div className='flex flex-col items-center mt-16 space-y-16'>
        <TitleCard track={track} />
        <MainInfos track={track} audioFeatures={audioFeatures} />
        <Seperator title='audio features' />
        <AudioFeatures track={track} audioFeatures={audioFeatures} />
        <Seperator title='recommendations' />
        <TrackCollection tracks={recommendations.tracks}></TrackCollection>
        <Seperator title='other' />
        <IdCollection ids={track.external_ids} />
        <LinkCollection urls={track.external_urls} />
        <div className='mb-16' />
    </div>;
}

export default withRouter(TrackPage);