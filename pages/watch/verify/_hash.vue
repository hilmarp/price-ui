<template>
  <v-container>
    <h1 class="text-h4 mt-5 mb-3">Staðfesta netfang</h1>
    <v-alert v-if="error" type="error"
      >Villa kom upp við að staðfesta netfang</v-alert
    >
    <v-alert v-if="!error && sent" type="success">
      Netfang hefur verið staðfest, þú færð núna tilkynningu þegar vara lækkar í
      verði
    </v-alert>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      error: false,
      sent: false,
    }
  },
  async mounted() {
    const hash = this.$route.params.hash

    if (!hash) {
      this.error = true
      return
    }

    try {
      await this.$axios.$post(`/watch/verify/${hash}`)
    } catch {
      this.error = true
    } finally {
      this.sent = true
    }
  },
}
</script>
