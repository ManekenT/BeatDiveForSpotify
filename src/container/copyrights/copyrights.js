function Copyrights(props) {
    var copyrightComponents = [];
    props.copyrights.forEach((object) => {
        if (object.type === 'C') {
            copyrightComponents.push(
                <div key={object.type}>
                    © {object.text}
                </div>
            );
        } else if (object.type === 'P') {
            copyrightComponents.push(
                <div key={object.type}>
                    ℗ {object.text}
                </div>
            );
        }
    });
    return <div className="sectionItem">
        {copyrightComponents}
    </div>
}

export default Copyrights;