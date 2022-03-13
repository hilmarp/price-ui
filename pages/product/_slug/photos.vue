<template>
  <v-container>
    <v-row justify="center">
      <v-col :cols="12" :md="8">
        <div>
          <h1 class="headline font-weight-medium">{{ product.Title }}</h1>
          <h2 class="subtitle-1 mb-3">{{ product.ProductCode }}</h2>
          <v-btn :to="`/product/${product.Slug}`" nuxt color="primary">
            Fara til baka
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col :cols="12" :md="10" :lg="6" :xl="4">
        <div v-for="img in images" :key="img.ID" class="my-5">
          <v-img :src="img.URL" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ params, $axios, error }) {
    try {
      const product = await $axios.$get(`/product/${params.slug}`)
      return { product }
    } catch {
      error({ statusCode: 404, message: 'Vara fannst ekki' })
    }
  },
  data() {
    return {
      images: [],
    }
  },
  async mounted() {
    const images = await this.$axios.$get(`/product/${this.product.ID}/images`)
    this.images = images
  },
}
</script>
