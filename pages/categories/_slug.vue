<template>
  <v-container>
    <h1 class="text-h5 mt-5 text-capitalize">{{ category.Name }}</h1>
    <v-row v-if="categoryChildren.length" class="mt-1" dense>
      <v-col
        v-for="category in categoryChildren"
        :key="category.ID"
        cols="12"
        sm="auto"
      >
        <v-btn
          color="primary"
          outlined
          nuxt
          small
          block
          :disabled="loading"
          :to="`/categories/${category.Slug}`"
          >{{ category.Name }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row align="center" class="mb-4" justify="end">
      <v-col cols="12" md="8" lg="6" xl="4">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-select
              :items="orderByItems"
              label="Raða eftir"
              dense
              outlined
              hide-details
              clearable
              :value="orderBy"
              :disabled="loading"
              @change="handleOrderByChange"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="orderByDirItems"
              label="Röðun"
              dense
              outlined
              hide-details
              clearable
              :value="orderByDir"
              :disabled="loading"
              @change="handleOrderByDirChange"
            />
          </v-col>
        </v-row>
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
        :to="`/categories/${category.Slug}?page=${page - 1}`"
        :disabled="loading || page === 1"
      >
        <v-icon left>mdi-chevron-left</v-icon>
        Fyrri síða
      </v-btn>
      <v-btn
        color="primary"
        nuxt
        :to="`/categories/${category.Slug}?page=${page + 1}`"
        :disabled="loading || !hasNextPage"
      >
        Næsta síða
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { TOTAL_CATEGORY_PRODUCTS } from '../../utils/constants'
import ProductCard from '../../components/ProductCard'

export default {
  components: {
    ProductCard,
  },
  async asyncData({ params, $axios, error, store }) {
    try {
      const category = await $axios.$get(`/category/${params.slug}`)
      store.commit('categories/setCategorySlug', category.Slug)
      return { category }
    } catch {
      error({ statusCode: 404, message: 'Flokkur fannst ekki' })
    }
  },
  data() {
    return {
      orderByItems: [{ value: 'price', text: 'Verði' }],
      orderByDirItems: [
        { value: 'asc', text: 'Í hækkandi röð' },
        { value: 'desc', text: 'Í lækkandi röð' },
      ],
    }
  },
  head() {
    return {
      title: this.category.Name,
    }
  },
  computed: {
    products() {
      return this.$store.state.categories.products
    },
    productsToShow() {
      const productsCopy = [...this.products]

      if (productsCopy.length > TOTAL_CATEGORY_PRODUCTS) {
        productsCopy.pop()
      }

      return productsCopy
    },
    loading() {
      return this.$store.state.loading
    },
    page() {
      return this.$store.state.categories.page
    },
    orderBy() {
      return this.$store.state.categories.orderBy
    },
    orderByDir() {
      return this.$store.state.categories.orderByDir
    },
    hasNextPage() {
      return this.products.length > TOTAL_CATEGORY_PRODUCTS
    },
    categoryChildren() {
      return this.$store.state.categories.categoryChildren
    },
  },
  watch: {
    async $route(to) {
      // Page query param
      let page = 1
      if (to.query.page) {
        page = to.query.page
      }

      this.$store.commit('categories/setPage', page)
      await this.$store.dispatch('categories/getProducts')
      window.scrollTo(0, 0)
    },
  },
  async mounted() {
    // Page query param
    let page = 1
    if (this.$route.query.page) {
      page = this.$route.query.page
    }

    this.$store.commit('categories/setPage', page)

    // Get products and children categories
    await Promise.all([
      this.$store.dispatch('categories/getProducts'),
      this.$store.dispatch('categories/getCategoryChildren'),
    ])
  },
  methods: {
    async handleOrderByChange(val) {
      if (val && !this.orderByDir) {
        this.$store.commit('categories/setOrderByDir', 'asc')
      }

      if (!val) {
        this.$store.commit('categories/setOrderByDir', '')
      }

      this.$store.commit('categories/setOrderBy', val)
      await this.$store.dispatch('categories/getProducts')
    },
    async handleOrderByDirChange(val) {
      if (val && !this.orderBy) {
        this.$store.commit('categories/setOrderBy', 'price')
      }

      if (!val) {
        this.$store.commit('categories/setOrderBy', '')
      }

      this.$store.commit('categories/setOrderByDir', val)
      await this.$store.dispatch('categories/getProducts')
    },
  },
}
</script>
