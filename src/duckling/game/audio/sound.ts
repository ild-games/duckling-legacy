export interface Sound {
    loopSound: boolean;
    volume: number;
    soundKey: string;
}

export let defaultSound = {
    loopSound: false,
    volume: 1.0,
    soundKey: ""
}