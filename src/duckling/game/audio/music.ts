export interface Music {
    musicKey: string;
    volume: number;
    loopStart: number;
}

export let defaultMusic = {
    musicKey: "",
    volume: 1.0,
    loopStart: 0.0
};
