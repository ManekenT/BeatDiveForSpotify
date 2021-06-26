import Track from '../track/track';

interface Props {
    tracks: any
}

function TrackCollection(props: Props) {
    const trackComponents: any[] = [];
    for (const key in props.tracks) {
        const value = props.tracks[key];
        trackComponents.push(
            <Track key={key} imageUrl={value.album.images[0].url} name={value.name} />
        );
    }
    return <div className="trackCollection sectionItem">
        {trackComponents}
    </div>;
}

export default TrackCollection;