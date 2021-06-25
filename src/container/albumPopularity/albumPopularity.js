import Bar from "../bar/bar";

function AlbumPopularity(props) {
    return <div id="popularityLabel" className="sectionItem">
        <Bar value={props.popularity} />
        <div>popularity</div>
    </div>
}

export default AlbumPopularity;