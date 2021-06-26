interface Props {
    tracks: SpotifyApi.TrackObjectSimplified[]
}

function Tracklist(props: Props) {
    const trackComponents = [];
    for (const key in props.tracks) {
        const value = props.tracks[key];
        const index = Object.keys(props.tracks).indexOf(key);
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