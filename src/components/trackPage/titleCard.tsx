interface Props {
    track: SpotifyApi.TrackObjectFull
}

export function TitleCard(props: Props) {
    return <div className='flex h-36 space-x-6'>
        <img className='object-contain h-full border-4' src={props.track.album.images[0].url} alt='cover' />
        <div className=' flex flex-col justify-around text-left'>
            <div className='text-7xl font-semibold'>{props.track.name}</div>
            <div className='text-4xl font-medium'>
                {props.track.artists.map((artist, index) => {
                    if (props.track.artists.length === index + 1) {
                        return artist.name;
                    }
                    return artist.name + ', ';
                })}
            </div>
        </div>

    </div>;
}
