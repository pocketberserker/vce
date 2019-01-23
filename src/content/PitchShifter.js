"use strict";
import Jungle from "./jungle";

// FIXME: ニコニコだとrateが途中で戻る
export default class {
  constructor(content) {
    this._content = content;
    this.context = new AudioContext();
    this.jungle = new Jungle(this.context);

    this.connected = false;
    this.pitch = 0.0;
    this.rate = 1;
  }

  set pitch(p) {
    this.jungle.setPitchOffset(p, false);
  }

  set rate(r) {
    if (this.connected) {
      this.content.playbackRate = r;
    } else {
      this.previousRate = r;
    }
  }

  connect() {
    this.connected = true;
    if (this.source !== undefined && this.source !== null) {
      this.source.disconnect(this.context.destination);
    }
    if (!this.source) {
      this.source = this.context.createMediaElementSource(this.content);
    }
    this.source.connect(this.jungle.input);
    this.jungle.output.connect(this.context.destination);

    this.pitch = this.jungle.previousPitch;
    this.rate = this.previousRate;
  }

  disconnect() {
    this.connected = false;
    this.source.disconnect(this.jungle.input);
    this.jungle.output.disconnect(this.context.destination);
    this.source.connect(this.context.destination);
    this.previousRate = this.content.playbackRate;
    this.content.playbackRate = 1;
  }
}
