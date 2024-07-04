import VideoData from "./VideoData";

export type LoopType = "one" | "all" | "disabled";

export default class SongQueue {
  private queue: VideoData[] = [];
  looping: LoopType = "disabled";

  private contructor() {}

  addSongs(song: VideoData[]) {
    this.queue.push(...song);
  }

  addSongsAt(song: VideoData[], index: number) {
    this.queue.splice(index, 0, ...song);
  }

  currentSong(): VideoData | undefined {
    return this.queue[0];
  }

  nextSong(): VideoData | undefined {
    if (this.looping == "one") {
      return this.currentSong();
    }
    if (this.looping == "disabled") {
      this.queue.shift();
    }
    if (this.queue.length === 0) {
      return undefined;
    }
    if (this.looping == "all") {
      this.queue.push(this.queue.shift() as VideoData);
    }
    return this.currentSong();
  }

  skipSongs(n: number): VideoData | undefined {
    if (this.looping == "one") {
      return this.currentSong();
    }
    n = Math.min(n, this.queue.length);
    if (this.looping == "all") {
      this.addSongs(this.queue.slice(0, n));
    }
    this.queue = this.queue.slice(n);
    return this.currentSong();
  }

  shuffle() {
    const toShuffle = this.queue.slice(1);
    for (let i = toShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [toShuffle[i], toShuffle[j]] = [toShuffle[j], toShuffle[i]];
    }
    this.queue = [this.queue[0], ...toShuffle];
  }

  removeSong(index: number) {
    this.queue.splice(index, 1);
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  clear() {
    this.queue = this.queue.slice(0, 1);
  }

  setLoopType(type: LoopType): LoopType {
    return (this.looping = type);
  }

  getQueue() {
    return JSON.parse(JSON.stringify(this.queue));
  }
}
