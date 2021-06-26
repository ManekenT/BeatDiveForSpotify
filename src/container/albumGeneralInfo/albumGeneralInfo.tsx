function AlbumGeneralInfo(props: Props) {
    let typeText = 'A';
    if (props.album.album_type === 'album') {
        typeText += 'n';
    }
    typeText += ` ${props.album.album_type} by `;
    const artistNames: string[] = [];
    props.album.artists.forEach((artist) => {
        artistNames.push(artist.name);
    });
    typeText += artistNames.join(', ');
    return <div className="sectionItem">{typeText}</div>;
}

type Props = {
    album: SpotifyApi.AlbumObjectFull,
}

export default AlbumGeneralInfo;