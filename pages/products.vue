<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped :width="330">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Vörur</v-list-item-title>
          <v-list-item-subtitle>Flokka</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-content>
          <v-treeview
            :value="selectedCategories"
            :open="openCategories"
            :items="categories"
            :load-children="handleCategoryLoadChildren"
            item-key="ID"
            item-text="Name"
            dense
            selectable
            transition
            multiple-active
            open-on-click
            return-object
            @input="handleCategoryInput"
            @update:open="handleCategoryOpen"
          />
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <app-bar show-burger :on-burger-click="handleBurgerClick" />

    <v-main>
      <v-container>
        <div>
          <v-row justify="end" class="mt-2">
            <v-col cols="12" sm="6" md="4" xl="2">
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
            <v-col cols="12" sm="6" md="4" xl="2">
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
              :disabled="loading || page === 1"
              @click.prevent="handlePaginationChange(page - 1)"
            >
              <v-icon left>mdi-chevron-left</v-icon>
              Fyrri síða
            </v-btn>
            <v-btn
              color="primary"
              :disabled="loading || !hasNextPage"
              @click.prevent="handlePaginationChange(page + 1)"
            >
              Næsta síða
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-main>

    <ps-footer />
  </v-app>
</template>

<script>
import { TOTAL_ALL_PRODUCTS } from '../utils/constants'
import ProductCard from '../components/ProductCard'
import AppBar from '../components/AppBar'
import PsFooter from '../components/Footer'

export default {
  components: {
    ProductCard,
    AppBar,
    PsFooter,
  },
  layout: 'empty',
  data() {
    return {
      drawer: null,
      orderByItems: [{ value: 'price', text: 'Verði' }],
      orderByDirItems: [
        { value: 'asc', text: 'Í hækkandi röð' },
        { value: 'desc', text: 'Í lækkandi röð' },
      ],
    }
  },
  head() {
    return {
      title: 'Vörur',
    }
  },
  computed: {
    products() {
      return this.$store.state.products.products
    },
    productsToShow() {
      const productsCopy = [...this.products]

      if (productsCopy.length > TOTAL_ALL_PRODUCTS) {
        productsCopy.pop()
      }

      return productsCopy
    },
    loading() {
      return this.$store.state.loading
    },
    page() {
      return this.$store.state.products.page
    },
    hasNextPage() {
      return this.products.length > TOTAL_ALL_PRODUCTS
    },
    orderBy() {
      return this.$store.state.products.orderBy
    },
    orderByDir() {
      return this.$store.state.products.orderByDir
    },
    categories() {
      return this.$store.state.products.categories
    },
    openCategories() {
      return this.$store.state.products.openCategories
    },
    selectedCategories() {
      return this.$store.state.products.selectedCategories
    },
  },
  watch: {
    async $route(to) {
      // Page query param
      let page = 1
      if (to.query.page) {
        page = to.query.page
      }

      this.$store.commit('products/setPage', page)

      // Categories query param
      let categories = []
      if (to.query.categories) {
        categories = to.query.categories.split(',')
      }

      await this.$store.dispatch('products/getSetSelectedCategories', {
        categories,
      })

      await this.$store.dispatch('products/getProducts')
      window.scrollTo(0, 0)
    },
  },
  async mounted() {
    if (!this.categories.length) {
      await this.$store.dispatch('products/getCategories')
    }

    // Page query param
    let page = 1
    if (this.$route.query.page) {
      page = this.$route.query.page
    }

    this.$store.commit('products/setPage', page)

    // Categories query param
    let categories = []
    if (this.$route.query.categories) {
      categories = this.$route.query.categories.split(',')
    }

    await this.$store.dispatch('products/getSetSelectedCategories', {
      categories,
      onMount: true,
    })

    await this.$store.dispatch('products/getProducts')
  },
  methods: {
    async handleOrderByChange(val) {
      if (val && !this.orderByDir) {
        this.$store.commit('products/setOrderByDir', 'asc')
      }

      if (!val) {
        this.$store.commit('products/setOrderByDir', '')
      }

      this.$store.commit('products/setOrderBy', val || '')
      await this.$store.dispatch('products/getProducts')
    },
    async handleOrderByDirChange(val) {
      if (val && !this.orderBy) {
        this.$store.commit('products/setOrderBy', 'price')
      }

      if (!val) {
        this.$store.commit('products/setOrderBy', '')
      }

      this.$store.commit('products/setOrderByDir', val || '')
      await this.$store.dispatch('products/getProducts')
    },
    handleBurgerClick() {
      this.drawer = !this.drawer
    },
    async handleCategoryLoadChildren(category) {
      await this.$store.dispatch('products/getCategories', category.Slug)
    },
    handleCategoryInput(categories) {
      // Avoid ?categories= query param, empty that is, instead have nothing
      if (!categories.length) {
        const queryClone = Object.assign({}, this.$route.query)
        if (queryClone.categories) {
          delete queryClone.categories
        }

        this.$router.push({
          path: this.$route.path,
          query: {
            ...queryClone,
          },
        })
        return
      }

      const slugs = categories.map((c) => c.Slug)
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          categories: slugs.join(','),
        },
      })
    },
    handleCategoryOpen(categories) {
      this.$store.commit('products/setOpenCategories', categories)
    },
    handlePaginationChange(val) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          page: val,
        },
      })
    },
  },
}
</script>
