var client_id = '003e1f0c81d54149b97761a80f6a7270';
var spotifyApi = new SpotifyWebApi();
var trackId;

Chart.defaults.global.defaultFontColor = "rgba(255, 255, 255, 1)";
Chart.defaults.global.defaultFontFamily = "'Montserrat', sans-serif";
Chart.defaults.global.defaultFontSize = 15;
Chart.defaults.global.legend.display = false;

window.addEventListener("dragover", function(e) {
    e = e || event;
    e.preventDefault();
}, false);

window.addEventListener("drop", function(e) {
    e = e || event;
    e.preventDefault();
    var droppedText = e.dataTransfer.getData('Text');
    if (!droppedText.includes("open.spotify.com")) {
        return;
    }
    var id = getIDfromURI(droppedText);
    var url = '//' + location.host + location.pathname;
    url = url + "?id=" + id;

    window.location = url;
}, false);

$(document).ready(function() {
    $('#authorizeButton').click(function(e) {
        e.preventDefault();
        onAuthorize();
        return false;
    });

    var args = parseQuery();
    var arguments = parseFragment();


    if (Object.keys(arguments).length > 1) {
        // callback from spotify authorization
        var in30Minutes = 1 / 48;
        Cookies.set("access_token", arguments['access_token'], {
            expires: in30Minutes
        });
        spotifyApi.setAccessToken(arguments['access_token'])
        if ('state' in arguments) {
            trackId = arguments['state'];
        }
    }

    if ("id" in args) {
        trackId = args['id'];
    }

    if (typeof Cookies.get('access_token') != 'undefined') {
        spotifyApi.setAccessToken(Cookies.get('access_token'));
        $('#authorizeButton').addClass('disabled');
    }

    if (trackId) {
        loadTrackInfo(trackId);
    }
});

function resetAuthorization(errorThrown) {
    if (errorThrown == "Unauthorized") {
        $('#authorizeButton').removeClass('disabled');
    }
}

function onAuthorize() {
    authorizeUser()
}

function authorizeUser() {
    var redirect_uri = [location.protocol, '//', location.host, location.pathname].join('');;

    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' +
        '&redirect_uri=' + encodeURIComponent(redirect_uri);
    if (trackId) {
        url = url + "&state=" + trackId;
    }
    window.location = url;
}

function loadTrackInfo(trackID) {
    var trackUrl = "https://api.spotify.com/v1/tracks/" + trackID;
    var audioFeaturesUrl = "https://api.spotify.com/v1/audio-features/" + trackID;
    get(trackUrl, {}, loadInfos, empty_function);
    spotifyApi.getAudioFeaturesForTrack(trackID, function(error, success) {
        if (error) {
            resetAuthorization(error);
        } else {
            loadInfosWithToken(success);
        }
    });

}

function getArtists(artists) {
    var string = artists[0].name;
    for (var i = 1; i < artists.length; i++) {
        string = string.concat(" & " + artists[i].name);
    }
    return string;
}

function getChart(ctx, valence, energy, danceability, liveness, acousticness, instrumentalness, speechiness) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Valence", "Energy", "Danceability", "Liveness", "Acousticness", "Instrumentalness", "Speechiness"],
            datasets: [{
                label: 'Value',
                data: [valence, energy, danceability, liveness, acousticness, instrumentalness, speechiness],
                backgroundColor: [
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(29, 185, 84, 0.7)'
                ],
                borderColor: [
                    'rgba(29, 185, 84, 1)',
                    'rgba(29, 185, 84, 1)',
                    'rgba(29, 185, 84, 1)',
                    'rgba(29, 185, 84, 1)',
                    'rgba(29, 185, 84, 1)',
                    'rgba(29, 185, 84, 1)',
                    'rgba(29, 185, 84, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 12,
                        maxRotation: 0
                    }
                }]
            }
        }
    });
}

function loadInfos(data) {
    // title tile
    $("#titleTile").text(data.name + " - " + getArtists(data.artists));

    // general info tile
    $("#duration").text("Duration: " + msToDuration(data.duration_ms));
    $("#popularity").text("Popularity: " + data.popularity + "/100");
    $("#explicit").text("Explicit: " + getExplicit(data.explicit));
    $("#trackNumber").text("Track Number: " + data.track_number);
    $("#preview").attr('src', data.preview_url);
    var idElement = $("#id");
    idElement.attr('href', "https://open.spotify.com/track/" + data.id);
    idElement.text(data.id);

    // album tile
    get(data.album.href, {}, loadAlbumInfos);

    // artist tile
    data.artists.forEach(function(val, index, array) {
        get(val.href, {}, loadArtistInfos)
    });
}

function loadInfosWithToken(data) {
    // data tile
    var source = $("#featuresTemplate").html();
    var template = Handlebars.compile(source);
    $("main").append(template);
    var ctx = $("#chart");
    getChart(ctx, data.valence, data.energy, data.danceability, data.liveness, data.acousticness, data.instrumentalness, data.speechiness);

    // audio features
    $("#key").text("Key: " + keys[data.key] + " " + modes[data.mode]);
    $("#tempo").html("Tempo: " + Math.round(data.tempo) + " bpm");
    document.getElementById('bpmIndicator').style.animationDuration = 60 / Math.round(data.tempo) + "s";
    $("#loudness").text("Loudness: " + data.loudness + " db");
    $("#timeSignature").text("Time Signature: " + data.time_signature + "/4");
}

function loadAlbumInfos(album) {
    album.image = album.images[0].url;
    album.type = capitalizeFirstLetter(album.type);
    album.trackCount = album.tracks.items.length;
    album.genres = getGenreDiv(album.genres);
    var source = $("#albumTemplate").html();
    var template = Handlebars.compile(source);
    $("main").append(template(album));
    $('.materialboxed').materialbox();
}

function loadArtistInfos(artist) {
    artist.image = artist.images[0].url;
    artist.followers = artist.followers.total;
    artist.genres = getGenreDiv(artist.genres);
    var source = $("#artistTemplate").html();
    var template = Handlebars.compile(source);
    $("main").append(template(artist));
    $('.materialboxed').materialbox();
}

function getGenreDiv(genres) {
    var divString = "";
    genres.forEach(function(genre) {
        divString += "<div class='chip'>" + genre + "</div>";
    });
    return divString;
}
