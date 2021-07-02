
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modes = ['minor', 'major'];

export const parseFragment = (hashFragment: string) => {
    const hash = hashFragment.replace(/#/g, '');
    const all = hash.split('&');
    const args: any = {};
    all.forEach(function (keyvalue) {
        const kv: string[] = keyvalue.split('=');
        const key: string = kv[0];
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

export const getKey = (number: number) => {
    return keys[number];
}

export const getMode = (number: number) => {
    return modes[number];
}

export const scaleLoudness = (db: number) => {
    if (db > 0) {
        db = 0;
    }
    if (db < -60) {
        db = -60;
    }
    db = db * 100 / 60;
    db = db * -1;
    return 100 - db;
}
