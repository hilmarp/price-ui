<template>
  <v-container>
    <v-row justify="center" class="mt-4">
      <v-col :cols="12" :lg="8" :xl="6">
        <v-text-field
          :disabled="loading"
          :value="value"
          :placeholder="searchPlaceholder"
          outlined
          rounded
          append-icon="mdi-magnify"
          @click:append="handleSearch"
          @keydown="handleSearchKeydown"
          @input="handleSearchInput"
        />
      </v-col>
    </v-row>
    <div v-for="product in productsToShow" :key="product.Slug" class="my-4">
      <product-search-card :product="product" />
    </div>
    <div class="pb-10 pt-2">
      <v-btn
        color="primary"
        nuxt
        :to="`/search?value=${value}&page=${page - 1}`"
        :disabled="loading || page === 1"
      >
        <v-icon left>mdi-chevron-left</v-icon>
        Fyrri síða
      </v-btn>
      <v-btn
        color="primary"
        nuxt
        :to="`/search?value=${value}&page=${page + 1}`"
        :disabled="loading || !hasNextPage"
      >
        Næsta síða
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { TOTAL_SEARCH_RESULTS, SEARCH_PLACEHOLDER } from '../utils/constants'
import ProductSearchCard from '../components/ProductSearchCard'

export default {
  components: {
    ProductSearchCard,
  },
  head() {
    return {
      title: 'Leita',
    }
  },
  computed: {
    products() {
      return this.$store.state.search.products
    },
    productsToShow() {
      const productsCopy = [...this.products]

      if (productsCopy.length > TOTAL_SEARCH_RESULTS) {
        productsCopy.pop()
      }

      return productsCopy
    },
    hasNextPage() {
      return this.products.length > TOTAL_SEARCH_RESULTS
    },
    loading() {
      return this.$store.state.loading
    },
    value() {
      return this.$store.state.search.value
    },
    page() {
      return this.$store.state.search.page
    },
    searchPlaceholder() {
      return SEARCH_PLACEHOLDER
    },
  },
  watch: {
    async $route(to) {
      let page = 1
      if (to.query.page) {
        page = to.query.page
      }

      if (to.query.value) {
        this.$store.commit('search/setValue', to.query.value)
      }

      this.$store.commit('search/setPage', page)
      await this.$store.dispatch('search/search')
      window.scrollTo(0, 0)
    },
  },
  async mounted() {
    let page = 1
    if (this.$route.query.page) {
      page = this.$route.query.page
    }

    this.$store.commit('search/setPage', page)

    if (this.$route.query.value) {
      this.$store.commit('search/setValue', this.$route.query.value)
      await this.$store.dispatch('search/search')
    }
  },
  methods: {
    handleSearchInput(val) {
      this.$store.commit('search/setValue', val)
    },
    handleSearch() {
      this.$store.commit('search/setPage', 1)

      this.$router.push({
        path: this.$route.path,
        query: { value: this.value, page: 1 },
      })
    },
    handleSearchKeydown(e) {
      if (e.keyCode === 13) {
        this.handleSearch()
      }
    },
  },
}
</script>
