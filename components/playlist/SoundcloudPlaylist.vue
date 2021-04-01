<template>
  <transition name="playlist-fade">
    <div v-show="showPlaylist" class="soundcloud-playlist" :class="{'show-playlist': showPlaylist}">
      <div class="playlist-background-layer" @click="togglePlaylist"></div>
      <iframe
        :id="iframeId"
        width="350px"
        height="600"
        class="playlist-iframe"
        frameborder="no"
        :src="`${playlistEmbedUrl}&color=%23${color}&start_track=${startTrack}&show_teaser=true&visual=true&sharing=${stringBoolean(sharing)}&show_artwork=${stringBoolean(
        showArtwork
      )}`"
      />
    </div>
  </transition>
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
      playlistStoreUnsubscribe: null,
      playlistInitDelay: 1000,
      autoplayDelay: 1000
    };
  },
  computed: {
    ...mapGetters({
      shuffle: 'playlist/shuffle',
      shuffleOrder: 'playlist/shuffleOrder',
      tracks: 'playlist/tracks',
      activeTrackIndex: 'playlist/activeTrackIndex',
      activeShuffleIndex: 'playlist/activeShuffleIndex',
      showPlaylist: 'playlist/showPlaylist',
    })
  },
  methods: {
    togglePlay() {
      this.playlist.toggle();
    },
    nextTrack() {
      if (this.shuffle) {
        if (this.activeShuffleIndex === this.tracks.length - 1) {
          this.goToTrack(this.shuffleOrder[0]);
        } else {
          this.goToTrack(this.shuffleOrder[this.activeShuffleIndex + 1]);
        }
      } else {
        if (this.activeTrackIndex === this.tracks.length - 1) {
          this.goToTrack(0);
        } else {
          this.playlist.next();
        }
      }
    },
    prevTrack() {
      if (this.shuffle) {
        if (this.activeShuffleIndex === 0) {
          this.goToTrack(this.shuffleOrder[this.tracks.length - 1]);
        } else {
          this.goToTrack(this.shuffleOrder[this.activeShuffleIndex - 1]);
        }
      } else {
        if (this.activeTrackIndex === 0) {
          this.goToTrack(this.tracks.length - 1);
        } else {
          this.playlist.prev();
        }
      }
    },
    goToTrack(index) {
      this.playlist.skip(index);
    },
    seekTo(milliseconds) {
      this.playlist.seekTo(milliseconds);
    },
    initSoundcloudPlayer() {
      setTimeout(() => {
        this.playlist = SC.Widget(document.getElementById(this.iframeId));

        // Playlist events and listeners
        // Set tracks into local state
        this.playlist.getSounds((response) => {
          this.$store.dispatch('playlist/setTracks', response);
          this.$store.dispatch('playlist/setShuffleOrder');
        });

        this.playlist.bind(SC.Widget.Events.READY, () => {
          console.log("PLAYLIST: READY");
          setTimeout(() => {
            this.goToTrack(this.shuffleOrder[0]);
          }, this.autoplayDelay);
        });

        // playlist is playing
        this.playlist.bind(SC.Widget.Events.PLAY, () => {
          console.log('PLAYLIST: PLAY TRACK');
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

        // In case of error
        this.playlist.bind(SC.Widget.Events.ERROR, () => {
          alert('there is an error');
        });

      }, this.playlistInitDelay);
    },
    togglePlaylist() {
      this.$store.dispatch('playlist/toggleShowPlaylist');
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
      } else if (e.keyCode === 27) {  // ESC key
        if (this.showPlaylist) {
          this.togglePlaylist();
        }
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
  watch: {
    showPlaylist: {
      immediate: true,
      handler: function(value) {
        this.$store.dispatch('setBodyScrollLock', value);
      }
    }
  },
  beforeDestroy() {
    this.playlistStoreUnsubscribe();
  }
};
</script>

<style scoped lang="scss">
.soundcloud-playlist {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $playlist-z-index;
}

.playlist-background-layer {
  @include absoluteAndFill;

  background-color: rgba($color-gray-300, 0.5);
  cursor: pointer;
}

.playlist-iframe {
  position: relative;
  width: 60vw;
  height: 80vh;
}
</style>
