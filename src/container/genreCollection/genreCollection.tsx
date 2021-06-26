import Genre from '../genre/genre';

interface Props {
    genres: string[]
}

function GenreCollection(props: Props) {
    if (props.genres.length === 0) {
        return null;
    }
    const genreTagComponents = [];
    for (const key in props.genres) {
        const value = props.genres[key];
        genreTagComponents.push(
            <Genre name={value} key={key} />
        );
    }
    return <div className="tagContainer sectionItem">
        {genreTagComponents}
    </div>;
}

export default GenreCollection;