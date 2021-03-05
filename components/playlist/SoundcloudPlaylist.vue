<template>
  <div class="soundcloud-playlist">
    <iframe
      :id="iframeId"
      width="500px"
      height="450"
      frameborder="no"
      allow="autoplay"
      :src="`${playlistEmbedUrl}&color=%23${color}&auto_play=${stringBoolean(
        autoplay
      )}&start_track=${startTrack}&show_teaser=true&visual=true&sharing=${stringBoolean(sharing)}&show_artwork=${stringBoolean(
        showArtwork
      )}`"
    ></iframe>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'SoundcloudPlaylist',
  props: {
    /**
     * URL of the playlist embed, without any parameters on it. Like:
     * https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1217713789
     */
    playlistEmbedUrl: {
      type: String,
      required: true,
    },
    /**
     * Whether or not to autoplay the playlist upon init
     */
    autoplay: {
      type: Boolean,
      default: true,
    },
    /**
     * Color of play button and waveform visualization
     */
    color: {
      type: String,
      default: 'ff00fb',
    },
    /**
     * Whether or not to provide share button on playlist/track
     */
    sharing: {
      type: Boolean,
      default: false,
    },
    /**
     * Track index to start playing the playlist from
     */
    startTrack: {
      type: Number,
      default: 0,
    },
    /**
     * Whether or not to show the album artwork
     */
    showArtwork: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      iframeId: 'soundcloudIframe',
      playlist: null,
      playlistStoreUnsubscribe: null
    };
  },
  computed: {
    ...mapGetters({
      shuffle: 'playlist/shuffle',
      tracks: 'playlist/tracks',
      activeTrackIndex: 'playlist/activeTrackIndex'
    })
  },
  methods: {
    togglePlay() {
      this.playlist.toggle();
    },
    nextTrack() {
      if (this.activeTrackIndex === this.tracks.length - 1) {
       this.goToTrack(0);
      } else {
        this.playlist.next();
      }
    },
    prevTrack() {
      if (this.activeTrackIndex === 0) {
        this.goToTrack(this.tracks.length - 1);
      } else {
        this.playlist.prev();
      }
    },
    goToTrack(index) {
      this.playlist.skip(index);
    },
    seekTo(milliseconds) {
      this.playlist.seekTo(milliseconds);
    },
    initSoundcloudPlayer() {
      let widgetScript = document.createElement('script');
      widgetScript.setAttribute('src', '/js/soundcloudWidget.js');
      widgetScript.onload = () => {
        setTimeout(() => {
          this.playlist = SC.Widget(document.getElementById(this.iframeId));

          // Playlist events and listeners
          this.playlist.bind(SC.Widget.Events.READY, () => {
            // Set tracks into local state
            this.playlist.getSounds((response) => {
              this.$store.dispatch('playlist/setTracks', response);
            });

            // playlist is playing
            this.playlist.bind(SC.Widget.Events.PLAY, () => {
              this.$store.dispatch('playlist/setPlaying', true);

              this.playlist.getCurrentSoundIndex(index => {
                this.$store.dispatch('playlist/setActiveTrackIndex', index);

                if (!this.tracks[index].title) {
                  this.playlist.getCurrentSound((response) => {
                    console.log('set track to: ', response.title);
                    this.$store.dispatch('playlist/setTrack', {index: index, data: response});
                  });
                }
              })
            });

            // playlist is paused
            this.playlist.bind(SC.Widget.Events.PAUSE, () => {
              this.$store.dispatch('playlist/setPlaying', false);
            });

            // Listen for final track to keep playlist alive
            this.playlist.bind(SC.Widget.Events.FINISH, () => {
              this.playlist.getCurrentSoundIndex(index => {
                if (index === this.tracks.length - 1) {
                  this.goToTrack(0);
                  this.seekTo(0);
                }
              });
            });
          });
        }, 500);
      };
      document.head.appendChild(widgetScript);
    }
  },
  mounted() {
    this.initSoundcloudPlayer();

    // Keystroke listeners for playlist control
    window.addEventListener('keydown', (e) => {
      if (e.keyCode == 32) {          // Space key
        e.preventDefault();
        this.togglePlay();
      } else if (e.keyCode == 39) {   // Right arrow
        this.nextTrack();
      } else if (e.keyCode == 37) {   // Left arrow
        this.prevTrack();
      }
    });

    // Playlist control actions subscription
    this.playlistStoreUnsubscribe = this.$store.subscribeAction((action) => {
      if (action.type === 'playlist/toggleTrack') {
        this.togglePlay();
      } else if (action.type === 'playlist/nextTrack') {
        this.nextTrack();
      } else if (action.type === 'playlist/prevTrack') {
        this.prevTrack();
      }
    });
  },
  beforeDestroy() {
    this.playlistStoreUnsubscribe();
  }
};
</script>

<style scoped lang="scss"></style>
