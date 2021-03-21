<template>
  <article class="home-page">
    <div class="home-page-intro">
      <div class="title-video-background">
<!--        <video autoplay loop muted playsinline preload="auto" width="100%">-->
<!--          <source src="https://www.jonathandempsey.dev/wp-content/uploads/2020/05/waves.mp4" type="video/mp4">-->
<!--        </video>-->
        <img src="https://media2.giphy.com/media/l2x7mzCCX7oDX2r0PD/giphy.gif" />
      </div>
      <layout-container class="title-text-container">
        <h1 class="title">
          Lost Trail Parking Lot
          <span class="dotcom">.com</span>
        </h1>
      </layout-container>
    </div>
    <layout-container class="home-page-content">
      <base-cta-link :url="`/manifesto`">Read Manifesto</base-cta-link>
    </layout-container>
  </article>
</template>

<script>
import {request, gql} from '@/cms/datocms';
import {pageMeta} from '~/mixins/pageMeta';
import LayoutContainer from '@/components/layout/LayoutContainer';
import BaseCtaLink from '@/components/base/BaseCtaLink';

export default {
  components: {BaseCtaLink, LayoutContainer},
  mixins: [pageMeta],
  asyncData: async () => {
    const data = await request({
      query: gql`
        {
          page: homePage {
            title
          }

          posts: allPosts(first: 3) {
            slug
            title
            description
          }
        }
      `,
    });

    return {ready: !!data, ...data};
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  background-color: #000;
  color: white;
}

.home-page-intro {
  position: relative;
}

.title-video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /deep/ {
    video,
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
    }
  }
}

.title-text-container {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: $background-dark-color;
  padding-top: calc(#{$header-height} + #{$spacing-200});
  padding-bottom: $spacing-300;
  color: $reversed-type-color;
  mix-blend-mode: multiply;
}

.title {
  margin: 0;
  max-width: 9ch;
  font-size: 18vw;
  font-weight: 600;
  line-height: 1;

  @media (min-width: 900px) {
    font-size: 175px;
  }
}

.dotcom {
  display: block;
}
</style>
