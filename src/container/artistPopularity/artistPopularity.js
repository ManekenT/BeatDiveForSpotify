import Bar from "../bar/bar";

function ArtistPopularity(props) {
    return <div id="popularityLabel" className="sectionItem">
        <div>
            {props.followers} followers and
        </div>
        <Bar value={props.popularity} />
        <div>popularity</div>
    </div>
}

export default ArtistPopularity;