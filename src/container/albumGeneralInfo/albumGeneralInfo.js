function AlbumGeneralInfo(props) {
    var typeText = 'A';
    if (props.type === 'album') {
        typeText += 'n';
    }
    typeText += ` ${props.type} by `;
    var artistNames = [];
    props.artists.forEach((artist) => {
        artistNames.push(artist.name)
    });
    typeText += artistNames.join(', ');
    return <div className="sectionItem">{typeText}</div>
}

export default AlbumGeneralInfo;