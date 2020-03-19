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
        e('div', {
            id: 'artistTopPanel'
        },
            e(ArtistGeneralInfoSection, {
                genres: props.genres,
                followers: props.followers,
                popularity: props.popularity
            }),
            e(ArtistRecommendationsSection, {

            })),
        e(ArtistLinksSection, {
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

function ArtistGeneralInfoSection(props) {
    return e('div', {
        id: 'artistGeneralInfoSection',
        className: 'section'
    },
        e(SectionHeader, {
            title: 'General Info'
        }),
        e(TextProperty, {
            title: 'Genres',
            text: props.genres
        }),
        e(TextProperty, {
            title: 'Followers',
            text: props.followers
        }),
        e(BarProperty, {
            title: 'Popularity',
            value: props.popularity
        })
    );
}

function ArtistLinksSection(props) {
    var urlComponents = [];
    for (var key in props.urls) {
        var value = props.urls[key];
        urlComponents.push(e(UrlProperty, {
            title: key,
            text: value,
            key: key
        }))
    }
    return e('div', {
        id: 'artistUrlSection',
        className: 'section'
    },
        e(SectionHeader, {
            title: 'Links'
        }),
        urlComponents
    );
}

function ArtistRecommendationsSection(props) {
    return e('div', {
        id: 'artistRecommendationsSection',
        className: 'section'
    },
        e(SectionHeader, {
            title: 'Recommendations'
        }),
    );
}

function SectionHeader(props) {
    return e('div', {
        className: 'sectionHeader'
    }, props.title);
}

function TextProperty(props) {
    return e('div', {
        className: 'textProperty'
    }, `${props.title}: ${props.text}`);
}

function UrlProperty(props) {
    return e('div', {
        className: 'textProperty'
    },
        `${props.title}: `,
        e('a', {
            href: props.text
        }, props.text)
    );
}

function BarProperty(props) {
    const progressStyle = {
        width: `${props.value}%`,
    };

    return e('div', {
        className: 'textProperty barProperty'
    },
        e('div', {

        },
            `${props.title}:`
        ),
        e('progress', {
            max: 100,
            value: props.value
        }, props.value
        ));
}