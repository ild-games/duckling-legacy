export interface Sound {
  soundKey: string;
  volume: number;
  pitch: number;
}

export let defaultSound = {
  soundKey: "",
  volume: 1.0,
  pitch: 1.0
};
