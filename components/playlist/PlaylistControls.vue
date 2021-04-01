<template>
  <div class="playlist-controls">
    <transition name="fade">
      <div v-if="activeTrackData" class="playlist-marquee">
        <p class="marquee-text">
          <span>{{activeTrackData.title}}</span>
          <span v-if="activeTrackData.artist">
            {{ activeTrackData.artist }}
          </span>
          <span v-if="activeTrackData.album">
            - ({{activeTrackData.album}})
          </span>
        </p>
      </div>
    </transition>
    <div class="playlist-control-container">
      <button @click="toggleShuffle" class="button-utility button-shuffle">
        <base-icon icon="shuffle" :class="['shuffle-icon', {'active': shuffle}]" />
      </button>
      <div class="playlist-main-control-container">
        <button @click="prev" class="button-control button-prev"><base-icon icon="backward" /></button>
        <button @click="toggle" class="button-control button-toggle">
          <transition name="fade" mode="out-in">
            <base-icon v-if="playing" icon="pause" />
            <base-icon v-else icon="play" />
          </transition>
        </button>
        <button @click="next" class="button-control button-next"><base-icon icon="forward" /></button>
      </div>
      <button @click="togglePlaylist" class="button-utility button-playlist"><base-icon icon="playlist" /></button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import BaseIcon from '~/components/base/BaseIcon';

export default {
  name: 'PlaylistControls',
  components: {BaseIcon},
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
          title: this.activeTrack.title,
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
    },
    toggleShuffle() {
      this.$store.dispatch('playlist/toggleShuffle');
    },
    togglePlaylist() {
      this.$store.dispatch('playlist/toggleShowPlaylist');
    }
  }
}
</script>

<style scoped lang="scss">
$marquee-height: $spacing-175;

.playlist-controls {
  width: 100%;
  margin: 0 auto;
  padding: calc(#{$marquee-height} + #{$spacing-100}) $gutter-mobile $spacing-100;
  color: $color-white;
  background-color: rgba($color-gray-900, 0.7);
  backdrop-filter: blur(5px);

  /deep/ {
    svg {
      fill: $color-white;
    }
  }
}

.playlist-marquee {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  overflow: hidden;

  /deep/ {
    > * {
      display: flex;
      align-items: center;
      margin: 0;
      white-space: nowrap;
    }
  }
}

.marquee-text {
  width: max-content;
  padding-left: 100%;
  will-change: transform;
  animation: marquee 25s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
}

@keyframes marquee {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}

.playlist-control-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.playlist-main-control-container {
  padding: 0 $spacing-200;
}

.button-control {
  margin: 0 $spacing-50;

  /deep/ svg {
    width: $spacing-175;
    height: $spacing-175;
  }
}

.shuffle-icon {
  &.active {
    fill: $color-primary;
  }
}
</style>
