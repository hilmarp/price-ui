<template>
  <v-app-bar app color="primary" dark clipped-left>
    <v-app-bar-nav-icon
      v-if="showBurger"
      class="d-flex d-lg-none"
      @click.stop="onBurgerClick"
    />
    <nuxt-link to="/" style="line-height: 1">
      <v-icon class="mr-3">mdi-chart-line</v-icon>
    </nuxt-link>
    <v-toolbar-title>
      <nuxt-link to="/">
        <span class="white--text" style="text-decoration: none">
          Verð frá
        </span>
      </nuxt-link>
    </v-toolbar-title>
    <div v-if="showSearch" class="app-bar-search d-none d-md-flex">
      <search-autocomplete dense />
    </div>
    <v-spacer />
    <v-btn to="/categories" nuxt text class="d-none d-md-flex">Vörur</v-btn>
    <v-btn to="/sale-products" nuxt text class="d-none d-md-flex">Tilboð</v-btn>
    <v-btn to="/popular-products" nuxt text class="d-none d-md-flex"
      >Mest skoðað</v-btn
    >
    <v-btn to="/price-changes" nuxt text class="d-none d-md-flex"
      >Verðbreytingar</v-btn
    >
    <v-menu left bottom>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" class="d-md-none" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/search" nuxt>
          <v-list-item-title>Leita</v-list-item-title>
        </v-list-item>
        <v-list-item to="/categories" nuxt>
          <v-list-item-title>Vörur</v-list-item-title>
        </v-list-item>
        <v-list-item to="/sale-products" nuxt>
          <v-list-item-title>Tilboð</v-list-item-title>
        </v-list-item>
        <v-list-item to="/popular-products" nuxt>
          <v-list-item-title>Mest skoðað</v-list-item-title>
        </v-list-item>
        <v-list-item to="/price-changes" nuxt>
          <v-list-item-title>Verðbreytingar</v-list-item-title>
        </v-list-item>
        <v-list-item to="/help" nuxt>
          <v-list-item-title>Hjálp</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import SearchAutocomplete from './SearchAutocomplete'

export default {
  components: {
    SearchAutocomplete,
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    showBurger: {
      type: Boolean,
      default: false,
    },
    onBurgerClick: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.app-bar-search {
  margin-left: 40px;
  width: 500px;
}
</style>
