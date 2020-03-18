'use strict';

const e = React.createElement;

function LoginButton(props) {
    return e('button', {
        id: 'loginButton',
        onClick: props.onClick
    }, 'Login')
}

function AccountLabel(props) {
    return e('div', {
        id: 'account_label'
    }, e('img', {
        id: 'account_image',
        src: props.image_url
    }), e('div', {
        id: 'account_name'
    }, props.display_name));
}

function Default(props) {
    return e('div', {
        id: 'defaultContent'
    }, 'Drag and drop a Spotify link over here. Artist, user, song, playlist or album!');
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
    }, e('div', {
        id: 'contentType'
    }, props.contentType),
        e('div', {
            className: 'contentHeader'
        }, imageElement, e('div', {
            className: 'contentTitle item'
        }, props.title)));
}