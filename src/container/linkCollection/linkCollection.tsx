interface Props {
    urls: SpotifyApi.ExternalUrlObject
}

function LinkCollection(props: Props) {
    return <div className='text-3xl'>
        <a className='underline' href={props.urls.spotify} >
            spotify
        </a>
    </div>;
}

export default LinkCollection;