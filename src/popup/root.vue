<template>
  <v-app>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-btn
          :loading="changing"
          :disabled="contentEnabled === false || changing"
          color="secondary"
          @click="change()"
          >{{ label }}</v-btn
        >
        <v-flex xs12>
          <v-subheader class="pl-0">Pitch</v-subheader>
          <v-slider
            v-model="pitch"
            :disabled="contentEnabled === false"
            :thumb-size="24"
            min="-1"
            step="0.01"
            max="1"
            thumb-label="always"
            @change="apply({pitch: pitch})"
          ></v-slider>
        </v-flex>
        <v-flex xs12>
          <v-subheader class="pl-0">Rate</v-subheader>
          <v-slider
            v-model="rate"
            :disabled="contentEnabled === false"
            :thumb-size="24"
            min="0.5"
            step="0.01"
            max="3.0"
            thumb-label="always"
            @change="apply({rate: rate})"
          ></v-slider>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    contentEnabled: false,
    changing: false,
    changed: false,
    rate: 1.0,
    pitch: 0
  }),
  mounted() {
    chrome.storage.sync.get(["pitch", "rate"], items => {
      if ("pitch" in items) {
        this.pitch = items.pitch;
      }
      if ("rate" in items) {
        this.rate = items.rate;
      }
    });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: "setup"}, null, response => {
        if (response) {
          this.contentEnabled = response["contentEnabled"];
          this.changed = response["changed"];
        }
      });
    });
  },
  computed: {
    label() {
      return this.changed ? "Stop" : "Change!";
    }
  },
  methods: {
    change() {
      this.changing = true;
      const type = this.changed ? "stop" : "start";
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type}, null, response => {
          if (response) {
            this.changed = response["changed"];
            this.changing = false;
          }
        });
      });
    },
    apply(value) {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            ...value,
            type: "update"
          },
          null,
          () => {
            chrome.storage.sync.set(value);
          }
        );
      });
    }
  }
};
</script>
