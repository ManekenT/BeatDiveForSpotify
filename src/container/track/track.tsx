import '@fortawesome/fontawesome-free/css/all.css'
import { Link } from 'react-router-dom';

interface Props {
    track: SpotifyApi.TrackObjectFull
    clicked: () => void
}

function Track(props: Props) {
    return <div className='flex h-20 items-center text-3xl font-medium border-4'>
        <img className="object-contain h-full" src={props.track.album.images[0].url} alt='track' />
        <div className='flex flex-col justify-around text-left p-4'>
            <div className="text-2xl underline"><Link to={'/track/' + props.track.id}>{props.track.name}</Link></div>
            <div className='text-lg underline'>
                {props.track.artists.map((artist, index) => {
                    return <Link to={"/artist/" + artist.id}>{artist.name} </Link>;
                })}
            </div>
        </div>
        <div className='group w-20 h-20 flex justify-center items-center'>
            <i className="transform transition-transform group-hover:scale-125 fas fa-play" onClick={props.clicked}></i>
        </div>
    </div>;
}

export default Track;