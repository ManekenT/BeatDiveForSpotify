import placeholderImg from '../../res/placeholderImg.png';

interface Props {
    contentType: string,
    title?: string,
    imageUrl?: string,
}

function ContentHeader(props: Props) {
    var imageSrc: string;
    if (props.imageUrl === undefined) {
        imageSrc = placeholderImg;
    } else {
        imageSrc = props.imageUrl;
    }
    return <div>
        <div id="contentType">{props.contentType}</div>
        <div className="title">
            <img className="titleImage item" src={imageSrc} alt="cover" />
            <h1 className="titleText item">{props.title}</h1>
        </div>
    </div>;
}

export default ContentHeader;