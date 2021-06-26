import Bar from '../bar/bar';

interface Props {
    popularity: number
}

function AlbumPopularity(props: Props) {
    return <div id="popularityLabel" className="sectionItem">
        <Bar value={props.popularity} />
        <div>popularity</div>
    </div>;
}

export default AlbumPopularity;