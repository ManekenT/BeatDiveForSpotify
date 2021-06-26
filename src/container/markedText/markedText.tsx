interface Props {
    children: any
}

function MarkedText(props: Props) {
    return <div className="markedText">
        {props.children}
    </div>;
}

export default MarkedText;