function IdCollection(props) {
    var idComponents = [];
    for (var key in props.ids) {
        var value = props.ids[key];
        idComponents.push(
            <div key={key}>
                {key}: {value}
            </div>
        );
    }
    return <div className="sectionItem">
        {idComponents}
    </div>
}

export default IdCollection;