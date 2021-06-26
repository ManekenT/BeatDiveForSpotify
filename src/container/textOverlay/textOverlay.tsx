import TextContainer from '../textContainer/textContainer';

interface Props {
    children: any
}

function TextOverlay(props: Props) {
    return <div className="overlay">
        <TextContainer>{props.children}</TextContainer>
    </div>;
}

export default TextOverlay;