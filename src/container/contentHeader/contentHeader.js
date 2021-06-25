function ContentHeader(props) {

    if (props.images[0]) {
        var imageElement = <img className="titleImage item" src={props.images[0].url} />
    }
    return <div>
        <div id="contentType">{props.contentType}</div>
        <div className="title">
            {imageElement}
            <h1 className="titleText item">{props.title}</h1>
        </div>
    </div>;
}

export default ContentHeader;