interface Props {
    value: number
}

function Bar(props: Props) {
    return <div className="progressBar">
        <span className="progressBarValue" style={{ width: `${props.value}%` }}>
            {props.value}%
        </span>
    </div>;
}

export default Bar;