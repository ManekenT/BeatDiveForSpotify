import TextContainer from "../textContainer/textContainer";

function TextOverlay(props) {
    return <div className="overlay">
        <TextContainer>{props.children}</TextContainer>
    </div>;
}

export default TextOverlay;