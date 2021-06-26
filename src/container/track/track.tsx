interface Props {
    imageUrl: string,
    name: string
}

function Track(props: Props) {
    return <div className="trackLabel item">
        <img className="trackImage" src={props.imageUrl} alt='track' />
        <div className="item">{props.name}</div>
    </div>;
}

export default Track;