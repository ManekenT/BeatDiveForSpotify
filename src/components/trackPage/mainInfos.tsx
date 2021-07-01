import { getKey, getMode, msToDuration } from '../../lib/util';
import './track.css';

interface Props {
    track: SpotifyApi.TrackObjectFull
    audioFeatures: SpotifyApi.AudioFeaturesObject
}

export function MainInfos(props: Props) {
    return <div className='text-3xl'>
        <div className='flex space-x-24 text-center'>
            <div>{msToDuration(props.track.duration_ms)}</div>
            <div>{getKey(props.audioFeatures.key)} {getMode(props.audioFeatures.mode)}</div>
            <div>{Math.round(props.audioFeatures.tempo)} bpm</div>
            <div>{props.audioFeatures.time_signature}/4</div>
            {props.track.explicit &&
                <div>explicit</div>
            }
        </div>
    </div>
}
