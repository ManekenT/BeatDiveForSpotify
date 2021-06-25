function Track(props) {
    return <div className="trackLabel item">
        <img className="trackImage" src={props.imageUrl} />
        <div className="item">{props.name}</div>
    </div>
}

export default Track;