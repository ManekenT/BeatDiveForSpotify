import Bar from "../../container/bar/bar";

interface Props {
    track: SpotifyApi.TrackObjectFull
    audioFeatures: SpotifyApi.AudioFeaturesObject
}

export function AudioFeatures(props: Props) {
    return <div className='grid grid-cols-9 text-2xl h-64'>
        <Bar title='popularity' value={props.track.popularity} />
        <Bar title='danceability' value={props.audioFeatures.danceability * 100} />
        <Bar title='energy' value={props.audioFeatures.energy * 100} />
        <Bar title='valence' value={props.audioFeatures.valence * 100} />
        <Bar title='acousticness' value={props.audioFeatures.acousticness * 100} />
        <Bar title='instrumentalness' value={props.audioFeatures.instrumentalness * 100} />
        <Bar title='liveness' value={props.audioFeatures.liveness * 100} />
        <Bar title='speechiness' value={props.audioFeatures.speechiness * 100} />
        <Bar title='loudness' value={props.audioFeatures.loudness} />
    </div>;
}