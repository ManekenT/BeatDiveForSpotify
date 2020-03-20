'use strict';

const e = React.createElement;

function AccountLabel(props) {
    return e(React.Fragment, {},
        e('img', {
            id: 'accountImage',
            src: props.image_url,
        }),
        e('div', {
            id: 'accountName',
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
    return e(React.Fragment, {},
        e(ContentHeader, {
            title: props.name,
            image: image,
            contentType: props.contentType
        }),

        e(GenreTags, {
            genres: props.genres
        }),
        e(Popularity, {
            popularity: props.popularity,
            followers: props.followers
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'top tracks'),
        e(Tracklist, {
            tracks: props.tracks
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'spotify recommendations'),
        e(Tracklist, {
            tracks: props.recommendations
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'artist links'),
        e(ArtistLinks, {
            urls: props.urls
        })
    );
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
            className: 'titleImage item',
            src: props.image
        })
    }
    return e(React.Fragment, {},
        e('div', {
            id: 'contentType',
            className: 'dark'
        }, props.contentType),
        e('div', {
            className: 'title dark'
        },
            imageElement,
            e('h1', {
                className: 'titleText item'
            }, props.title)
        )
    );
}

function ArtistLinks(props) {
    var urlComponents = [];
    for (var key in props.urls) {
        var value = props.urls[key];
        urlComponents.push(e('a', {
            href: value,
            key: key
        }, key));
    }
    return e(React.Fragment, {}, urlComponents);
}


function Popularity(props) {
    return e('div', {
        id: 'popularityLabel'
    },
        e('div', {}, `${props.followers} followers and`),
        e(ProgressBar, {
            value: props.popularity
        }),
        e('div', {}, 'popularity')
    );
}
function ProgressBar(props) {
    return e('div', {
        className: 'progressBar sectionItem'
    },
        e('div', {
            className: 'progressBarValue',
            style: {
                width: `${props.value}%`
            }
        },
            e('span', {}, `${props.value}%`)));
}

function GenreTags(props) {
    var genreTagComponents = [];
    for (var key in props.genres) {
        var value = props.genres[key];
        genreTagComponents.push(e('div', {
            className: 'tag item',
            key: key
        }, value));
    }
    return e('div', {
        className: 'tagContainer sectionItem'
    }, genreTagComponents);
}

function Tracklist(props) {
    var trackComponents = [];
    for (var key in props.tracks) {
        var value = props.tracks[key];
        trackComponents.push(e('div', {
            className: 'trackLabel item',
            key: key
        },
            e('img', {
                className: 'trackImage',
                src: value.album.images[0].url,
            }),
            e('div', {
                className: 'item'
            }, value.name)));
    }
    return e('div', {
        className: 'trackCollection sectionItem'
    }, trackComponents);
}