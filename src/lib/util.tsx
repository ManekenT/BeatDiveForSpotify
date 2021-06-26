
//const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
//const modes = ['Minor', 'Major'];

export const parseFragment = () => {
    const hash = window.location.hash.replace(/#/g, '');
    const all = hash.split('&');
    const args: any = {};
    all.forEach(function (keyvalue) {
        const kv: string[] = keyvalue.split('=');
        const key: string = kv[0];
        args[key] = kv[1];
    });
    return args;
};

export const parseQuery = () => {
    const hash = window.location.search.replace(/\?/g, '');
    const all = hash.split('&');
    const args: any = {};
    all.forEach(function (keyvalue) {
        const kv = keyvalue.split('=');
        const key = kv[0];
        args[key] = kv[1];
    });
    return args;
};

export const msToDuration = (ms: number) => {
    const i = Math.floor(ms / 1000);
    const seconds = i % 60;
    const minutes = (i - seconds) / 60;
    if (seconds < 10) {
        return '' + minutes + ':0' + seconds;
    }
    return '' + minutes + ':' + seconds;
};

export const getExplicit = (explicit: boolean) => {
    if (explicit) {
        return 'Yes';
    }
    return 'No';
};

export const parseStateString = (string: string) => {
    const state = string.split('_');
    return {
        id: state[0],
        type: state[1]
    };
};