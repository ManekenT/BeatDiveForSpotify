import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const e = React.createElement;
const spotifyApi = new SpotifyWebApi();

export function Default(props) {
    return e('div', {
        id: 'defaultContent'
    }, 'Drag and drop a Spotify link over here. Artist, user, song, playlist or album!');
}

export function LoginAppeal(props) {
    return e('div', {
        className: 'overlay'
    },
        e('div', {
            className: 'item'
        }, 'Please authorize this site with spotify. It doesn\'t really make sense without access to the Spotify Api.'),
        e('button', {
            className: 'item',
            id: 'authorizeButton',
            onClick: props.authorize
        }, 'Authorize')
    );
}

export function BlockerInfo() {
    return e('div', {
        className: 'overlay'
    },
        e('div', {},
            'Something is blocking requests to the spotify api. Please allow this site to access ',
            e('div', {
                className: 'markedText'
            }, 'api.spotify.com'),
            ' and refresh the page. Thanks!'
        )
    );
}

export function Artist(props) {
    return e(React.Fragment, {},
        e(ContentHeader, {
            title: props.name,
            images: props.images,
            contentType: 'Artist'
        }),

        e(GenreTags, {
            genres: props.genres
        }),
        e(ArtistPopularity, {
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
        e(TrackCollectionWithImages, {
            tracks: props.recommendations
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'artist links'),
        e(Links, {
            urls: props.urls
        }),
        e('div', { className: 'seperator' })
    );
}

export class Track extends React.Component {

    constructor(props) {
        super(props);
        this.state = { track: '' };
        this.trackId = props.id;
    }

    componentDidMount() {
        spotifyApi.getTrack(this.trackId, {}, (error, track) => {
            if (error) {
                console.log();
                //return handleApiError(error);
            }
            this.setState({
                track: track
            });
        });
    }

    render() {
        if (this.state.track !== '') {
            return <ContentHeader
                title={this.state.track.name} images={this.state.track.album.images} contentType='Track'
            />;
        } else {
            return null;
        }
    }
}

export function Playlist(props) {
    return e(ContentHeader, {
        title: props.name,
        images: props.images,
        contentType: 'Playlist'
    });
}

export function User(props) {
    return e(ContentHeader, {
        title: props.name,
        images: props.images,
        contentType: 'User'
    });
}

export function Album(props) {
    return e(React.Fragment, {},
        e(ContentHeader, {
            title: props.name,
            images: props.images,
            contentType: 'Album'
        }),
        e(AlbumGeneralInfo, {
            type: props.type,
            artists: props.artists
        }),
        e('div', { className: 'sectionItem' }, `Released ${props.releaseDate} on ${props.label}`),
        e(GenreTags, {
            genres: props.genres
        }),
        e(AlbumPopularity, {
            popularity: props.popularity,
            followers: props.followers
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'tracks'),
        e(Tracklist, {
            tracks: props.tracks
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'spotify recommendations'),
        e(TrackCollectionWithImages, {
            tracks: props.recommendations
        }),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'business info'),
        e(Copyright, {
            copyrights: props.copyrights
        }),
        e(Ids, {
            ids: props.ids
        }),
        e('div', { className: 'sectionItem' }, props.markets),
        e('div', { className: 'seperator' }),
        e('h2', {}, 'artist links'),
        e(Links, {
            urls: props.urls
        }),
        e('div', { className: 'seperator' })
    );
}

export function ContentHeader(props) {
    if (props.images[0]) {
        var imageElement = e('img', {
            className: 'titleImage item',
            src: props.images[0].url
        })
    }
    return e(React.Fragment, {},
        e('div', {
            id: 'contentType',
        }, props.contentType),
        e('div', {
            className: 'title'
        },
            imageElement,
            e('h1', {
                className: 'titleText item'
            }, props.title)
        )
    );
}

export function Links(props) {
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

export function Copyright(props) {
    var copyrightComponents = [];
    props.copyrights.forEach((object) => {
        if (object.type === 'C') {
            copyrightComponents.push(e('div', {
                key: 'C'
            }, `© ${object.text}`));
        } else if (object.type === 'P') {
            copyrightComponents.push(e('div', {
                key: 'P'
            }, `℗ ${object.text}`));
        }
    });
    return e('div', { className: 'sectionItem' }, copyrightComponents);
}

export function Ids(props) {
    var idComponents = [];
    for (var key in props.ids) {
        var value = props.ids[key];
        idComponents.push(e('div', {
            key: key
        }, `${key}: ${value}`));
    }
    return e('div', { className: 'sectionItem' }, idComponents);
}

export function ArtistPopularity(props) {
    return e('div', {
        id: 'popularityLabel',
        className: 'sectionItem'
    },
        e('div', {}, `${props.followers} followers and`),
        e(ProgressBar, {
            value: props.popularity
        }),
        e('div', {}, 'popularity')
    );
}

export function AlbumPopularity(props) {
    return e('div', {
        id: 'popularityLabel',
        className: 'sectionItem'
    },
        e(ProgressBar, {
            value: props.popularity
        }),
        e('div', {}, 'popularity')
    );
}

export function AlbumGeneralInfo(props) {
    var typeText = 'A';
    if (props.type === 'album') {
        typeText += 'n';
    }
    typeText += ` ${props.type} by `;
    var artistNames = [];
    props.artists.forEach((artist) => {
        artistNames.push(artist.name)
    });
    typeText += artistNames.join(', ');
    return e('div', { className: 'sectionItem' }, typeText);
}

export function ProgressBar(props) {
    return e('div', {
        className: 'progressBar',
    },
        e('span', {
            className: 'progressBarValue',
            style: {
                width: `${props.value}%`
            }
        }, `${props.value}%`)
    );
}

export function GenreTags(props) {
    if (props.genres.length === 0) {
        return null;
    }
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

export function TrackCollectionWithImages(props) {
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

export function Tracklist(props) {
    var trackComponents = [];
    for (var key in props.tracks) {
        var value = props.tracks[key];
        var index = Object.keys(props.tracks).indexOf(key)
        trackComponents.push(e('div', {
            className: 'item',
            key: key
        }, `${index + 1}. ${value.name}`));
    }
    return e('div', {
        className: 'tracklist sectionItem'
    }, trackComponents);
}