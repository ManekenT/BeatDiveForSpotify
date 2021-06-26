interface Props {
    ids: SpotifyApi.ExternalIdObject
}

function IdCollection(props: Props) {
    const idComponents = [];
    if (props.ids.ean !== undefined) {
        idComponents.push(
            <div key="ean">
                ean: {props.ids.ean}
            </div>
        );
    }
    if (props.ids.isrc !== undefined) {
        idComponents.push(
            <div key="isrc">
                isrc: {props.ids.isrc}
            </div>
        )
    }
    if (props.ids.upc !== undefined) {
        idComponents.push(
            <div key="upc">
                upc: {props.ids.upc}
            </div>
        );
    }
    return <div className="sectionItem">
        {idComponents}
    </div>;
}

export default IdCollection;