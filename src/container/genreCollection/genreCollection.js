import Genre from "../genre/genre";

function GenreCollection(props) {
    if (props.genres.length === 0) {
        return null;
    }
    var genreTagComponents = [];
    for (var key in props.genres) {
        var value = props.genres[key];
        genreTagComponents.push(
            <Genre name={value} key={key} />
        );
    }
    return <div className="tagContainer sectionItem">
        {genreTagComponents}
    </div>
}

export default GenreCollection;