<template>
  <article class="home-page">
    <page-wrapper spacing below-masthead>
      <layout-container class="home-page-inner">
        <div class="title-container">
          <h1 class="title">
            Lost Trail Parking Lot
            <span class="dotcom">.com</span>
          </h1>
        </div>
        <base-cta-link :url="`/manifesto`">Read Manifesto</base-cta-link>
      </layout-container>
    </page-wrapper>
  </article>
</template>

<script>
import {request, gql} from '@/cms/datocms';
import {pageMeta} from '~/mixins/pageMeta';
import PageWrapper from '@/components/layout/PageWrapper';
import LayoutContainer from '@/components/layout/LayoutContainer';
import BaseCtaLink from '@/components/base/BaseCtaLink';

export default {
  components: {BaseCtaLink, LayoutContainer, PageWrapper},
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
  min-height: 100vh;
}

.home-page-inner {
  display: flex;
  justify-content: center;
}

.title-container {
  width: fit-content;

  /* The magic */
  -webkit-background-clip: text;
  color: transparent;

  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(https://media2.giphy.com/media/l2x7mzCCX7oDX2r0PD/giphy.gif);
}

.title {
  margin: 0;
  max-width: 9ex;
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
