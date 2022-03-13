<template>
  <v-app>
    <app-bar :show-search="false" />

    <v-main>
      <section id="home-hero">
        <v-container>
          <v-row justify="center">
            <v-col :cols="12" :lg="5">
              <client-only>
                <div class="text-center mb-5">
                  <v-sparkline
                    :value="sparkline.value"
                    auto-draw
                    auto-line-width
                    :height="50"
                    color="#fff"
                    smooth
                    :line-width="2"
                  />
                </div>
              </client-only>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col :cols="12" :lg="8">
              <h1 class="text-h5 text-center white--text">
                Leitaðu eftir vefslóð, vöruheiti, lýsingu eða vörunúmeri og
                sjáðu niðurstöður frá mörgum vefverslunum í einu, verðsögu aftur
                í tímann eða fáðu tilkynningu þegar vara lækkar í verði
              </h1>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col :cols="12" :lg="6">
              <div class="pt-8">
                <search-autocomplete />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <v-container>
        <div class="py-10">
          <div class="pb-5">
            <h2 class="text-h5">
              Mest skoðað
              <v-btn
                to="/popular-products"
                nuxt
                color="info"
                light
                outlined
                small
              >
                Sjá fleiri
              </v-btn>
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="product in popularProducts"
              :key="product.ID"
              :cols="12"
              :sm="6"
              :md="4"
              :lg="3"
              :xl="2"
            >
              <product-card
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
        </div>
      </v-container>

      <div class="grey lighten-4 py-10">
        <v-container>
          <div class="pb-5">
            <h2 class="text-h5">
              Mestar verðbreytingar síðustu tvær vikur
              <v-btn to="/price-changes" nuxt color="info" light outlined small>
                Sjá fleiri
              </v-btn>
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="product in priceChangeProducts"
              :key="product.ID"
              :cols="12"
              :sm="6"
              :md="4"
              :lg="3"
              :xl="2"
            >
              <product-card
                :product="product"
                :prev-price="
                  product.PriceLower
                    ? product.Price + product.PriceDiff
                    : product.Price - product.PriceDiff
                "
              />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container>
        <div class="py-10">
          <div class="pb-5">
            <h2 class="text-h5">
              Tilboð
              <v-btn to="/sale-products" nuxt color="info" light outlined small>
                Sjá fleiri
              </v-btn>
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="product in saleProducts"
              :key="product.ID"
              :cols="12"
              :sm="6"
              :md="4"
              :lg="3"
              :xl="2"
            >
              <product-card
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
        </div>
      </v-container>
    </v-main>

    <ps-footer />
  </v-app>
</template>

<script>
import ProductCard from '../components/ProductCard'
import SearchAutocomplete from '../components/SearchAutocomplete'
import AppBar from '../components/AppBar'
import PsFooter from '../components/Footer'

export default {
  components: {
    ProductCard,
    SearchAutocomplete,
    AppBar,
    PsFooter,
  },
  layout: 'empty',
  data() {
    return {
      sparkline: {
        value: [
          99000, 99000, 101000, 102000, 99900, 99950, 95000, 90000, 100000,
          110000, 95900, 89000, 90000,
        ],
      },
      popularProducts: [],
      priceChangeProducts: [],
      saleProducts: [],
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    async getProducts() {
      const popularProducts = this.$axios.$get('/products/popular?limit=12')

      const priceChangeProducts = this.$axios.$get(
        '/products/price-changes?limit=12'
      )

      const saleProducts = this.$axios.$get(
        '/products?on_sale=true&limit=12&order_by=updated_at&order_by_dir=desc'
      )

      const res = await Promise.all([
        popularProducts,
        priceChangeProducts,
        saleProducts,
      ])

      this.popularProducts = res[0] || []
      this.priceChangeProducts = res[1] || []
      this.saleProducts = res[2] || []
    },
  },
}
</script>
