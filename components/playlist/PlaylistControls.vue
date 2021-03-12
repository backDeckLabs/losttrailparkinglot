<template>
  <div class="playlist-controls">
    <transition name="fade">
      <div v-if="activeTrackData" class="playlist-marquee">
        <h5>{{activeTrackData.title}}</h5>
        <p>
          <template v-if="activeTrackData.artist">
            {{ activeTrackData.artist }}
          </template>
          <template v-if="activeTrackData.album">
            - ({{activeTrackData.album}})
          </template>
        </p>
      </div>
    </transition>
    <div class="playlist-main-control-container">
      <button @click="prev"><base-icon icon="backward" /></button>
      <button @click="toggle">
        <transition name="fade" mode="out-in">
          <base-icon v-if="playing" icon="pause" />
          <base-icon v-else icon="play" />
        </transition>
      </button>
      <button @click="next"><base-icon icon="forward" /></button>
    </div>
    <div class="playlist-utility">
      <button @click="toggleShuffle">
        <base-icon icon="shuffle" :class="['shuffle-icon', {'active': shuffle}]" />
      </button>
      <button @click="togglePlaylist"><base-icon icon="playlist" /></button>
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
$marquee-height: $spacing-300;

.playlist-controls {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  padding: calc(#{$marquee-height} + #{$spacing-100 * 2}) $gutter-mobile $spacing-100;
  color: $color-white;
  background-color: rgba($color-gray-900, 0.5);
  backdrop-filter: blur(5px);
  z-index: 100000;

  /deep/ {
    svg {
      fill: $color-white;
    }
  }
}

.shuffle-icon {
  &.active {
    fill: $color-primary;
  }
}

.playlist-marquee {
  position: absolute;
  top: 0;
  left: 50%;
  left: 0;
  //transform: translateX(-50%);

  /deep/ {
    > * {
      //width: 100%;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }

    .roller {
      //width: 100%;
    }
  }
}
</style>
