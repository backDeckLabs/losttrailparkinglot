<template>
  <article class="manifesto-page">
    <page-wrapper spacing below-masthead>
      <layout-container>
        <h1>Manifesto</h1>
        <base-button :link-path="routes.home()">Back Home</base-button>
      </layout-container>
    </page-wrapper>
  </article>
</template>

<script>
import PageWrapper from '@/components/layout/PageWrapper';
import LayoutContainer from '@/components/layout/LayoutContainer';
import BaseButton from '@/components/base/BaseButton';
export default {
  name: 'manifesto',
  components: {BaseButton, LayoutContainer, PageWrapper}
}
</script>

<style scoped lang="scss"></style>
