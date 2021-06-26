
interface Props {
    copyrights: SpotifyApi.CopyrightObject[]
}

function Copyrights(props: Props) {
    var copyrightComponents: any[] = [];
    props.copyrights.forEach((object) => {
        if (object.type === 'C') {
            copyrightComponents.push(
                <div key={object.type}>
                    © {object.text}
                </div>
            );
        } else if (object.type === 'P') {
            copyrightComponents.push(
                <div key={object.type}>
                    ℗ {object.text}
                </div>
            );
        }
    });
    return <div className="sectionItem">
        {copyrightComponents}
    </div>;
}

export default Copyrights;