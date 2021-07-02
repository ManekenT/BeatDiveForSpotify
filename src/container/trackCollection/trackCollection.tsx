import Track from '../track/track';

interface Props {
    tracks: any
}

function TrackCollection(props: Props) {
    const trackComponents: any[] = [];
    for (const key in props.tracks) {
        const value = props.tracks[key];
        trackComponents.push(
            <Track key={key} imageUrl={value.album.images[0].url} name={value.name} artists={value.artists} />
        );
    }
    return <div className='flex flex-wrap justify-center items-center gap-4'>
        {trackComponents}
    </div>;
}

export default TrackCollection;