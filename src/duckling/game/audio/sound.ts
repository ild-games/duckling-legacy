export interface Sound {
    
    loopSound: boolean;
    volume: number;
    soundKey: string;

}

export let defaultSound = {
    loopSound: false,
    volume: 100,
    soundKey: ""
}