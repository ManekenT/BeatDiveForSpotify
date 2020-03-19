'use strict';

const e = React.createElement;

function AccountLabel(props) {
    return e(React.Fragment, {},
        e('img', {
            id: 'accountImage',
            src: props.image_url
        }),
        e('div', {
            id: 'accountName'
        }, props.display_name));
}

function Artist(props) {
    if (props.images[0]) {
        var image = props.images[0].url;
    }
    return e(ContentHeader, {
        title: props.name,
        image: image,
        contentType: props.contentType
    });
}

function Track(props) {
    if (props.images[0]) {
        var image = props.images[0].url;
    }
    return e(ContentHeader, {
        title: props.name,
        image: image,
        contentType: props.contentType
    });
}

function Playlist(props) {
    if (props.images[0]) {
        var image = props.images[0].url;
    }
    return e(ContentHeader, {
        title: props.name,
        image: image,
        contentType: props.contentType
    });
}

function User(props) {
    if (props.images[0]) {
        var image = props.images[0].url;
    }
    return e(ContentHeader, {
        title: props.name,
        image: image,
        contentType: props.contentType
    });
}

function Album(props) {
    if (props.images[0]) {
        var image = props.images[0].url;
    }
    return e(ContentHeader, {
        title: props.name,
        image: image,
        contentType: props.contentType
    });
}

function ContentHeader(props) {
    if (props.image) {
        var imageElement = e('img', {
            className: 'contentImage item',
            src: props.image
        })
    }
    return e('div', {
        id: 'contentHeaderContainer'
    },
        e('div', {
            id: 'contentType'
        }, props.contentType),
        e('div', {
            className: 'contentHeader'
        },
            imageElement,
            e('div', {
                className: 'contentTitle item'
            }, props.title)
        )
    );
}