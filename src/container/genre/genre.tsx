interface Props {
    name: string
}

function Genre(props: Props) {
    return <div className="tag item">{props.name}</div>;
}

export default Genre;