<template>
  <article class="playlist-page">
    <page-wrapper spacing below-masthead>
      <layout-container content>
        <soundcloud-playlist
          playlist-embed-url="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1217713789"
        />
      </layout-container>
    </page-wrapper>
  </article>
</template>

<script>
import LayoutContainer from '@/components/layout/LayoutContainer';
import PageWrapper from '@/components/layout/PageWrapper';
import SoundcloudPlaylist from '@/components/patterns/SoundcloudPlaylist';
export default {
  name: 'playlist',
  components: {SoundcloudPlaylist, PageWrapper, LayoutContainer},
};
</script>

<style scoped lang="scss"></style>
