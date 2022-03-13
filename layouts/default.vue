<template>
  <v-app>
    <app-bar />

    <v-main>
      <nuxt />
    </v-main>

    <ps-footer />
  </v-app>
</template>

<script>
import AppBar from '../components/AppBar'
import PsFooter from '../components/Footer'

export default {
  components: {
    AppBar,
    PsFooter,
  },
}
</script>
