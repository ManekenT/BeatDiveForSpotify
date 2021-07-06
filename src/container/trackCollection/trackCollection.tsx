import Track from '../track/track';

interface Props {
    tracks: any
    clicked: (track: SpotifyApi.TrackObjectFull) => void
}

function TrackCollection(props: Props) {
    const trackComponents: any[] = [];
    for (const key in props.tracks) {
        const value = props.tracks[key];
        trackComponents.push(
            <Track key={key} track={value} clicked={() => { props.clicked(value) }} />
        );
    }
    return <div className='flex flex-wrap justify-center items-center gap-4'>
        {trackComponents}
    </div>;
}

export default TrackCollection;