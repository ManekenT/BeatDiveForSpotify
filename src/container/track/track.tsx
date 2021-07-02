interface Props {
    imageUrl: string,
    name: string,
    artists: any[]
}

function Track(props: Props) {
    return <div className='flex h-20 items-center text-3xl font-medium border-4'>
        <img className="object-contain h-full" src={props.imageUrl} alt='track' />
        <div className='flex flex-col justify-around text-left p-4'>
            <div className="text-2xl">{props.name}</div>
            <div className='text-lg'>
                {props.artists.map((artist, index) => {
                    if (props.artists.length === index + 1) {
                        return artist.name;
                    }
                    return artist.name + ', ';
                })}
            </div>
        </div>
    </div>;
}

export default Track;