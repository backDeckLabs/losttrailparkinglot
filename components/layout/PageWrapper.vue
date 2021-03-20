<template>
  <div class="page-wrapper" :class="{'below-masthead': belowMasthead, spacing: spacing}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageWrapper',
  props: {
    belowMasthead: {
      type: Boolean,
      default: false,
    },
    spacing: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.page-wrapper {
  position: relative;
  width: 100%;
  z-index: $main-page-z-index;

  &.spacing {
    @include pageSpacing;
  }

  &.below-masthead {
    padding-top: $header-height;

    &.spacing {
      padding-top: calc(#{$header-height} + #{$page-spacing-desktop});
    }
  }
}
</style>
