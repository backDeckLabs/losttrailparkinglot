<template>
  <header class="app-masthead">
    <layout-container class="masthead-inner">
      <button class="menu-toggle">MENU</button>
    </layout-container>
  </header>
</template>

<script>
import LayoutContainer from '@/components/layout/LayoutContainer';
export default {
  name: 'AppMasthead',
  components: {LayoutContainer},
};
</script>

<style scoped lang="scss">
.app-masthead {
  height: $header-height;
}

.masthead-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

.menu-toggle,
.tuner-toggle {
  color: $color-white;
}
</style>
