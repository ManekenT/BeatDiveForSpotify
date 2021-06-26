interface Props {
    tracks: SpotifyApi.TrackObjectSimplified[]
}

function Tracklist(props: Props) {
    var trackComponents = [];
    for (var key in props.tracks) {
        var value = props.tracks[key];
        var index = Object.keys(props.tracks).indexOf(key);
        trackComponents.push(
            <div className="item" key={key}>
                {index + 1}. {value.name}
            </div>);
    }
    return <div className="tracklist sectionItem">
        {trackComponents}
    </div>;
}

export default Tracklist;