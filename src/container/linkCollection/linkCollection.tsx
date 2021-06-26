interface Props {
    urls: SpotifyApi.ExternalUrlObject
}

function LinkCollection(props: Props) {
    return <div>
        <a href={props.urls.spotify} >
            spotify
        </a>
    </div>;
}

export default LinkCollection;