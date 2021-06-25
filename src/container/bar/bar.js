function Bar(props) {
    return <div className="progressBar">
        <span className="progressBarValue" style={{ width: `${props.value}%` }}>
            {props.value}%
        </span>
    </div>
}

export default Bar;