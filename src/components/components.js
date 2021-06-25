import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import ContentHeader from '../container/contentHeader/contentHeader';
import Tracklist from '../container/tracklist/tracklist';
import TrackCollection from '../container/trackCollection/trackCollection';
import Bar from '../container/bar/bar';
import GenreCollection from '../container/genreCollection/genreCollection';

const e = React.createElement;
const spotifyApi = new SpotifyWebApi();

export function Artist(props) {
    return e(React.Fragment, {},
        e(ContentHeader, {
            title: props.name,
            images: props.images,
            contentType: 'Artist'
        }),
        e(GenreCollection, {
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
        e(TrackCollection, {
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

export function Playlist(props) {
    return e(ContentHeader, {
        title: props.name,
        images: props.images,
        contentType: 'Playlist'
    });
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
        e(Bar, {
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
        e(Bar, {
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
