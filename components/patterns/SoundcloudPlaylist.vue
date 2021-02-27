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
    <button @click="togglePlay">Toggle</button>
  </div>
</template>

<script>
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
      tracks: null
    };
  },
  methods: {
    togglePlay() {
      this.playlist.toggle();
    },
    nextTrack() {
      this.playlist.next();
    },
    prevTrack() {
      this.playlist.prev();
    },
    goToTrack(index) {
      this.playlist.skip(index);
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
              this.tracks = response;
              console.log('tracks are: ', response);
            });

            this.playlist.bind(SC.Widget.Events.PLAY, () => {
              // playlist is playing
            });

            // Listen for final track to keep playlist alive
            this.playlist.bind(SC.Widget.Events.FINISH, () => {
              this.playlist.getCurrentSoundIndex(index => {
                console.log('index is: ', index);
                console.log('track length: ', this.tracks.length);
                if (index === this.tracks.length - 1) {
                  this.goToTrack(0);
                }
              })
            });
          });
        }, 500);
      };
      document.head.appendChild(widgetScript);
    }
  },
  mounted() {
    this.initSoundcloudPlayer();

    // Prevent body scroll on space key press
    window.addEventListener('keydown', function (e) {
      if (e.keyCode == 32) {
        e.preventDefault();
      }
    });
  },
};
</script>

<style scoped lang="scss"></style>
