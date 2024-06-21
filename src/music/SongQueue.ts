import VideoData from "./VideoData";

export default class SongQueue {
  private queue: VideoData[] = [];
  looping = false;

  private contructor() {}

  addSongs(song: VideoData[]) {
    this.queue.push(...song);
  }

  currentSong(): VideoData | undefined {
    return this.queue[0];
  }

  nextSong(): VideoData | undefined {
    if (this.looping) {
      this.queue.push(this.queue.shift() as VideoData);
    }
    this.queue.shift();
    return this.currentSong();
  }

  skipSongs(n: number): VideoData | undefined {
    this.queue = this.queue.slice(n);
    return this.currentSong();
  }

  shuffle() {
    for (let i = this.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
  }

  removeSong(index: number) {
    this.queue.splice(index, 1);
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  clear() {
    this.queue = [];
  }

  toggleLooping() {
    this.looping = !this.looping;
  }

  getQueue() {
    return JSON.parse(JSON.stringify(this.queue));
  }
}
