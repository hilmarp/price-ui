<template>
  <v-container>
    <h1 class="text-h5 pb-6 pt-6">Mest skoðað</h1>
    <v-row>
      <v-col
        v-for="product in productsToShow"
        :key="product.ID"
        :cols="12"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="2"
      >
        <product-card
          :img-height="200"
          :description-length="100"
          :product="product"
          :prev-price="
            product.PriceDiff === 0
              ? 0
              : product.PriceLower
              ? product.Price + product.PriceDiff
              : product.Price - product.PriceDiff
          "
        />
      </v-col>
    </v-row>
    <div class="pb-10 pt-6">
      <v-btn
        color="primary"
        nuxt
        :to="`/popular-products?page=${page - 1}`"
        :disabled="loading || page === 1"
      >
        <v-icon left>mdi-chevron-left</v-icon>
        Fyrri síða
      </v-btn>
      <v-btn
        color="primary"
        nuxt
        :to="`/popular-products?page=${page + 1}`"
        :disabled="loading || !hasNextPage"
      >
        Næsta síða
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { TOTAL_POPULAR_PRODUCTS } from '../utils/constants'
import ProductCard from '../components/ProductCard'

export default {
  components: {
    ProductCard,
  },
  head() {
    return {
      title: 'Mest skoðað',
    }
  },
  computed: {
    products() {
      return this.$store.state.popular.products
    },
    productsToShow() {
      const productsCopy = [...this.products]

      if (productsCopy.length > TOTAL_POPULAR_PRODUCTS) {
        productsCopy.pop()
      }

      return productsCopy
    },
    loading() {
      return this.$store.state.loading
    },
    page() {
      return this.$store.state.popular.page
    },
    hasNextPage() {
      return this.products.length > TOTAL_POPULAR_PRODUCTS
    },
  },
  watch: {
    async $route(to) {
      // Page query param
      let page = 1
      if (to.query.page) {
        page = to.query.page
      }

      this.$store.commit('popular/setPage', page)
      await this.$store.dispatch('popular/getProducts')
      window.scrollTo(0, 0)
    },
  },
  async mounted() {
    // Page query param
    let page = 1
    if (this.$route.query.page) {
      page = this.$route.query.page
    }

    this.$store.commit('popular/setPage', page)
    await this.$store.dispatch('popular/getProducts')
  },
}
</script>
