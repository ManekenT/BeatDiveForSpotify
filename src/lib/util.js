
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const modes = ["Minor", "Major"];

export const parseFragment = () => {
    var hash = window.location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    all.forEach(function (keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        args[key] = kv[1];
    });
    return args;
}

export const parseQuery = () => {
    var hash = window.location.search.replace(/\?/g, '');
    var all = hash.split('&');
    var args = {};
    all.forEach(function (keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        args[key] = kv[1];
    });
    return args;
}

export const msToDuration = (ms) => {
    var i = Math.floor(ms / 1000);
    var seconds = i % 60;
    var minutes = (i - seconds) / 60;
    if (seconds < 10) {
        return "" + minutes + ":0" + seconds;
    }
    return "" + minutes + ":" + seconds;
}

export const getExplicit = (explicit) => {
    if (explicit) {
        return "Yes";
    }
    return "No";
}

export const parseStateString = (string) => {
    var state = string.split('_');
    return {
        id: state[0],
        type: state[1]
    }
}