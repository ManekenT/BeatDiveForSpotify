import Track from '../track/track';

interface Props {
    tracks: any
}

function TrackCollection(props: Props) {
    var trackComponents: any[] = [];
    for (var key in props.tracks) {
        var value = props.tracks[key];
        trackComponents.push(
            <Track key={key} imageUrl={value.album.images[0].url} name={value.name} />
        );
    }
    return <div className="trackCollection sectionItem">
        {trackComponents}
    </div>;
}

export default TrackCollection;