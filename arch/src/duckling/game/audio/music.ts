export interface Music {
    musicKey: string;
    volume: number;
    loop: boolean;
    loopStart: number;
}

export let defaultMusic = {
    musicKey: "",
    volume: 1.0,
    loop: true,
    loopStart: 0.0,
};
