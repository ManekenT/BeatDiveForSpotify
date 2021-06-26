import Bar from '../bar/bar';

interface Props {
    popularity: number,
    followers: number
}

function ArtistPopularity(props: Props) {
    return <div id="popularityLabel" className="sectionItem">
        <div>
            {props.followers} followers and
        </div>
        <Bar value={props.popularity} />
        <div>popularity</div>
    </div>;
}

export default ArtistPopularity;