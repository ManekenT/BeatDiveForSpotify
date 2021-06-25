function LinkCollection(props) {
    var urlComponents = [];
    for (var key in props.urls) {
        var value = props.urls[key];
        urlComponents.push(
            <a href={value} key={key}>
                {key}
            </a>
        )
    }
    return <div>
        {urlComponents}
    </div>
}

export default LinkCollection;