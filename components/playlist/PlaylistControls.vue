<template>
  <div class="playlist-controls">
    <div class="playlist-main-control-container">
      <button @click="prev">Prev</button>
      <button @click="toggle">Toggle</button>
      <button @click="next">Next</button>
    </div>
    <div v-if="activeTrackData" class="playlist-marquee">
      <h5>{{activeTrackData.title}}</h5>
      <p>{{activeTrackData.artist}}</p>
    </div>
    <div class="playlist-utility">

    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'PlaylistControls',
  computed: {
    ...mapGetters({
      playing: 'playlist/isPlaying',
      activeTrack: 'playlist/activeTrack',
      shuffle: 'playlist/shuffle'
    }),
    activeTrackData() {
      if (this.activeTrack && this.activeTrack.title) {
        const trackData = this.activeTrack.publisher_metadata;

        return {
          title: trackData.release_title,
          artist: trackData.artist,
          album: trackData.album_title,
          songLink: this.activeTrack.permalink_url,
          artistLink: this.activeTrack.user.permalink_url,
          artwork: this.activeTrack.artwork_url,
          duration: this.activeTrack.full_duration
        }
      }
      return null
    },
    activeSongTitle() {
      return this.activeTrack ? this.activeTrack.title : null;
    },
    activeArtist() {
      return this.activeTrack && this.activeTrack.publisher_metadata ? this.activeTrack.publisher_metadata.artist : null;
    },
    activeAlbum() {
      return this.activeTrack && this.activeTrack.publisher_metadata ? this.activeTrack.publisher_metadata.album_title : null;
    }
  },
  methods: {
    toggle() {
      this.$store.dispatch('playlist/toggleTrack');
    },
    prev() {
      this.$store.dispatch('playlist/prevTrack');
    },
    next() {
      this.$store.dispatch('playlist/nextTrack');
    }
  }
}
</script>

<style scoped lang="scss">
.playlist-controls {
  color: $color-white;
}
</style>
