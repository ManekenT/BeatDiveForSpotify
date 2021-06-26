interface Props {
    children: any
}

function TextContainer(props: Props) {
    return <div id="textContainer">
        {props.children}
    </div>;
}

export default TextContainer;