<template>
  <v-container>
    <v-row class="mt-4 mb-4" align="center">
      <v-col cols="12" md="7" xl="9">
        <h1 class="text-h5">Mestar verðbreytingar síðustu tvær vikur</h1>
      </v-col>
      <v-col cols="12" md="5" xl="3">
        <v-select
          :items="typeItems"
          dense
          outlined
          hide-details
          :value="priceType"
          :disabled="loading"
          @change="handlePriceTypeChange"
        />
      </v-col>
    </v-row>
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
            product.PriceLower
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
        :to="`/price-changes?page=${page - 1}`"
        :disabled="loading || page === 1"
      >
        <v-icon left>mdi-chevron-left</v-icon>
        Fyrri síða
      </v-btn>
      <v-btn
        color="primary"
        nuxt
        :to="`/price-changes?page=${page + 1}`"
        :disabled="loading || !hasNextPage"
      >
        Næsta síða
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { TOTAL_PRICE_CHANGES } from '../utils/constants'
import ProductCard from '../components/ProductCard'

export default {
  components: {
    ProductCard,
  },
  data() {
    return {
      typeItems: [
        { value: 'drop', text: 'Verðlækkanir' },
        { value: 'hike', text: 'Verðhækkanir' },
        { value: 'drop_hike', text: 'Verðlækkanir & verðhækkanir' },
      ],
    }
  },
  head() {
    return {
      title: 'Mestar verðbreytingar síðustu tvær vikur',
    }
  },
  computed: {
    products() {
      return this.$store.state.changes.products
    },
    productsToShow() {
      const productsCopy = [...this.products]

      if (productsCopy.length > TOTAL_PRICE_CHANGES) {
        productsCopy.pop()
      }

      return productsCopy
    },
    loading() {
      return this.$store.state.loading
    },
    page() {
      return this.$store.state.changes.page
    },
    hasNextPage() {
      return this.products.length > TOTAL_PRICE_CHANGES
    },
    priceType() {
      return this.$store.state.changes.priceType
    },
  },
  watch: {
    async $route(to) {
      // Page query param
      let page = 1
      if (to.query.page) {
        page = to.query.page
      }

      this.$store.commit('changes/setPage', page)
      await this.$store.dispatch('changes/getProducts')
      window.scrollTo(0, 0)
    },
  },
  async mounted() {
    // Page query param
    let page = 1
    if (this.$route.query.page) {
      page = this.$route.query.page
    }

    this.$store.commit('changes/setPage', page)
    await this.$store.dispatch('changes/getProducts')
  },
  methods: {
    async handlePriceTypeChange(val) {
      this.$store.commit('changes/setPriceType', val)
      await this.$store.dispatch('changes/getProducts')
    },
  },
}
</script>
