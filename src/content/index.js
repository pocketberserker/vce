"use strict";
import PitchShifter from "./PitchShifter";

let converter = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setup") {
    if (converter) {
      sendResponse({
        contentEnabled: true,
        changed: converter.connected
      });
      return;
    }
    const content = document.querySelector("video");
    if (content) {
      sendResponse({
        contentEnabled: true,
        changed: false
      });
    } else {
      sendResponse({
        contentEnabled: false,
        changed: false
      });
    }
  } else if (message.type === "start") {
    if (converter && converter.connected) {
      sendResponse({changed: true});
      return;
    }
    convert();
    sendResponse({changed: true});
  } else if (message.type === "stop") {
    if (converter.connected === false) {
      sendResponse({changed: false});
      return;
    }
    converter.disconnect();
    sendResponse({changed: false});
  } else if (message.type === "update" && converter) {
    if ("pitch" in message) {
      converter.pitch = message.pitch;
    }
    if ("rate" in message) {
      converter.rate = message.rate;
    }
    sendResponse();
  }
});

const convert = () => {
  const video = document.querySelector("video");
  if (video) {
    if (!converter) {
      converter = new PitchShifter(video);
    }
    converter.connect();
    chrome.storage.sync.get(["pitch", "rate"], items => {
      if ("pitch" in items) {
        converter.pitch = items.pitch;
      }
      if ("rate" in items) {
        converter.rate = items.rate;
      }
    });
  }
};
