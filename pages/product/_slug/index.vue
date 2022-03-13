<template>
  <div>
    <v-container>
      <v-breadcrumbs :items="breadcrumbItems" />
      <v-row>
        <v-col :cols="12" :lg="4">
          <v-carousel>
            <v-carousel-item v-for="img in images" :key="img.ID">
              <v-img :src="img.URL" style="width: auto; height: auto" />
            </v-carousel-item>
          </v-carousel>
          <div class="mt-3 d-none">
            <v-btn
              :to="`/product/${product.Slug}/photos`"
              nuxt
              color="primary"
              text
              small
            >
              Sjá myndir í lista
            </v-btn>
          </div>
        </v-col>
        <v-col :cols="12" :lg="6">
          <v-chip v-if="product.OnSale" color="success" class="mb-4">
            Tilboð
            <v-icon right small>mdi-percent</v-icon>
          </v-chip>
          <h1 class="text-h4 mb-2">{{ product.Title }}</h1>
          <v-row dense>
            <v-col cols="auto">
              <v-btn
                small
                color="primary"
                outlined
                @click.prevent="$vuetify.goTo('#price-alert')"
              >
                <v-icon left>mdi-bell-alert</v-icon>
                Verðvakt
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                small
                color="primary"
                outlined
                @click.prevent="$vuetify.goTo('#price-history')"
              >
                <v-icon left>mdi-history</v-icon>
                Verðsaga
              </v-btn>
            </v-col>
          </v-row>
          <product-description
            class="mt-8"
            :description="product.Description"
            :description-length="300"
          />
          <div class="mt-6 text-h4">
            {{ price }}
            kr.
          </div>
          <div class="text-caption font-weight-light">{{ updatedAt }}</div>
        </v-col>
      </v-row>
    </v-container>
    <div class="mt-5 grey lighten-4 py-5">
      <v-container>
        <v-row>
          <v-col cols="12" xl="8">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row align="center">
                    <v-col cols="12" sm="auto">
                      <logo :source="product.Source" :width="logoWidth" />
                    </v-col>
                    <v-col cols="12" sm="auto">
                      <a
                        :href="gotoUrl"
                        target="_blank"
                        @click.stop="() => {}"
                        >{{ product.Title }}</a
                      >
                      <v-tooltip v-if="stocks.length > 0" top>
                        <template #activator="{ on }">
                          <v-icon
                            :color="
                              inStockAnywhere(stocks) ? 'success' : 'warning'
                            "
                            class="ml-2"
                            v-on="on"
                            >mdi-warehouse</v-icon
                          >
                        </template>
                        <span v-if="inStockAnywhere(stocks)">Til á lager</span>
                        <span v-else>Ekki til á lager</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" sm="auto" class="ml-auto">
                      <span class="text-h6">{{ price }} kr.</span>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-if="stocks.length > 0">
                    <v-row>
                      <v-col cols="12" lg="6" xl="4">
                        <v-simple-table>
                          <tbody>
                            <tr v-for="stock in stocks" :key="stock.ID">
                              <td>{{ stock.Location }}</td>
                              <td v-if="stock.InStock">
                                <span class="success--text font-weight-medium">
                                  Til á lager
                                </span>
                              </td>
                              <td v-else>
                                <span class="warning--text"
                                  >Ekki til á lager</span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                  </div>
                  <v-btn
                    color="info"
                    small
                    class="mt-4"
                    target="_blank"
                    :href="gotoUrl"
                  >
                    Sjá á {{ product.Source }}
                    <v-icon right>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="product.Description || specs.length">
      <v-container>
        <h3 class="text-h4 mb-4 mt-4">Vöruupplýsingar</h3>
        <v-row v-if="product.Description">
          <v-col cols="12" xl="8">
            <p>
              <span>
                {{ product.Description }}
              </span>
            </p>
          </v-col>
        </v-row>
        <v-row v-if="specs.length">
          <v-col cols="12" lg="8" xl="6">
            <ProductSpecList :specs="specs" />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-divider />
      <v-container>
        <h3 id="price-history" class="text-h4 mb-4 mt-4">Verðsaga</h3>
        <v-row dense class="mb-3">
          <v-col
            v-for="month in pricesAvailableMonths"
            :key="month"
            cols="12"
            sm="auto"
          >
            <v-btn
              block
              color="primary"
              :outlined="pricesMonths !== month"
              :disabled="!pricesLoaded"
              @click.prevent="handlePricesMonthClick(month)"
              >{{ month }} <span v-if="month === 1">mánuður</span
              ><span v-else>mánuðir</span></v-btn
            >
          </v-col>
        </v-row>
        <v-row class="mb-4">
          <v-col cols="12" xl="8">
            <div>
              <div v-if="!pricesLoaded" class="price-chart-loader">
                <v-progress-circular indeterminate color="primary" size="50" />
              </div>
              <line-chart
                v-if="pricesLoaded"
                :data="chartData"
                :options="chartOptions"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-divider />
      <v-container>
        <h3 id="price-alert" class="text-h4 mb-4 mt-4">Verðvakt</h3>
        <div>
          Tilkynning verður send á netfang þegar
          <span class="font-weight-medium">{{ product.Title }}</span> lækkar í
          verði
        </div>
        <v-row class="mt-2 mb-4">
          <v-col cols="12" xl="8">
            <v-form
              ref="watchForm"
              v-model="watchForm.valid"
              @submit.prevent="handleWatch"
            >
              <v-card outlined>
                <v-card-text>
                  <v-alert v-if="watchForm.error" type="error">
                    Villa kom upp við að skrá netfang
                  </v-alert>
                  <v-alert v-if="watchForm.sent" type="success">
                    Póstur hefur verið sendur á uppgefið netfang, til þess að fá
                    tilkynningu um verðlækkun þarf að staðfesta netfangið með
                    því að smella á hlekk í þeim pósti
                  </v-alert>
                  <v-text-field
                    v-model="watchForm.email"
                    :rules="watchForm.emailRules"
                    type="email"
                    label="Netfang"
                    required
                    outlined
                  />
                  <v-btn
                    color="primary"
                    large
                    type="submit"
                    :disabled="!watchForm.valid || watchForm.loading"
                  >
                    Skrá mig
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="relatedProductsNotThis.length > 0">
      <v-divider />
      <v-container>
        <div class="pt-5 pb-5">
          <h2 class="text-h4">
            Tengdar vörur
            <v-btn
              :to="`/search?value=${product.Title}`"
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
        <v-row class="pb-5">
          <v-col
            v-for="product in relatedProductsNotThis"
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
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import {
  getPrettyPrice,
  getPrettyDate,
  addDays,
  formatDateYMD,
} from '../../../utils/formatters'
import Logo from '../../../components/Logo'
import LineChart from '../../../components/LineChart'
import ProductCard from '../../../components/ProductCard'
import ProductDescription from '../../../components/ProductDescription'
import ProductSpecList from '../../../components/ProductSpecList'

export default {
  components: {
    Logo,
    LineChart,
    ProductCard,
    ProductDescription,
    ProductSpecList,
  },
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
      watchForm: {
        valid: false,
        loading: false,
        error: false,
        sent: false,
        email: '',
        emailRules: [
          (v) => !!v || 'Netfang vantar',
          (v) => /.+@.+/.test(v) || 'Ekki gilt netfang',
        ],
      },
      chartOptions: {
        maintainAspectRatio: false,
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                precision: 0,
                maxTicksLimit: 10,
                callback(value, index, values) {
                  return getPrettyPrice(value) + ' kr.'
                },
              },
            },
          ],
        },
        tooltips: {
          mode: 'x-axis',
          callbacks: {
            label(t, d) {
              return getPrettyPrice(t.yLabel) + ' kr.'
            },
          },
        },
      },
      pricesLoaded: false,
      pricesMonths: 1,
      pricesAvailableMonths: [1, 3, 6, 12],
      prices: [],
      stocks: [],
      specs: [],
      images: [],
      categories: [],
      relatedProducts: [],
    }
  },
  head() {
    return {
      title: this.product.Title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.product.Description,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${this.product.Title} - Verð frá`,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.product.Description,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.product.MainImgURL,
        },
      ],
    }
  },
  computed: {
    price() {
      return getPrettyPrice(this.product.Price)
    },
    updatedAt() {
      return getPrettyDate(this.product.UpdatedAt, true, true)
    },
    chartData() {
      const labels = []
      const data = []

      for (let i = 0; i < this.prices.length; i++) {
        const date = getPrettyDate(this.prices[i].Date, false)
        const price = this.prices[i].Price

        // Check for duplicate date, but only continue if the price is the same
        const foundIndex = labels.findIndex((l) => l === date)
        if (foundIndex !== -1 && data[foundIndex] === price) {
          continue
        }

        labels.push(date)
        data.push(price)
      }

      return {
        labels,
        datasets: [
          {
            label: 'Verð',
            data,
            fill: false,
            steppedLine: true,
            backgroundColor: '#1976d2',
            borderColor: '#1976d2',
          },
        ],
      }
    },
    logoWidth() {
      if (
        this.product.Source === 'ht.is' ||
        this.product.Source === 'rafha.is' ||
        this.product.Source === 'computer.is'
      ) {
        return 120
      }

      return 65
    },
    relatedProductsNotThis() {
      return this.relatedProducts.filter((p) => {
        return p.Slug !== this.product.Slug
      })
    },
    breadcrumbItems() {
      const bc = this.categories.map((cat) => {
        return {
          text: cat.Name,
          disabled: false,
          to: `/categories/${cat.Slug}`,
          nuxt: true,
        }
      })

      return [
        {
          text: 'Heim',
          disabled: false,
          href: '/',
        },
        ...bc,
      ]
    },
    categoriesString() {
      const cats = this.categories.map((cat) => {
        return cat.Name
      })
      return cats.join(', ')
    },
    gotoUrl() {
      return `https://api.verdfra.is/goto/${this.product.ID}`
    },
  },
  mounted() {
    this.getPrices()
    this.getStocks()
    this.getSpecs()
    this.getImages()
    this.getCategories()
    this.getRelatedProducts()
  },
  methods: {
    async getPrices() {
      const monthsAgo = addDays(Date.now(), -(30 * this.pricesMonths))
      const from = formatDateYMD(monthsAgo)

      this.pricesLoaded = false
      this.prices = []

      const prices = await this.$axios.$get(
        `/product/${this.product.ID}/prices?from=${from}`
      )

      this.pricesLoaded = true
      this.prices = prices || []
    },
    async getStocks() {
      const stocks = await this.$axios.$get(
        `/product/${this.product.ID}/stocks`
      )

      this.stocks = stocks
    },
    async getSpecs() {
      const specs = await this.$axios.$get(`/product/${this.product.ID}/specs`)
      this.specs = specs
    },
    async getImages() {
      const images = await this.$axios.$get(
        `/product/${this.product.ID}/images`
      )
      this.images = images
    },
    async getCategories() {
      const categories = await this.$axios.$get(
        `/product/${this.product.ID}/categories`
      )
      this.categories = categories
    },
    async getRelatedProducts() {
      const relatedProducts = await this.$axios.$get(
        `/search?limit=7&value=${this.product.Title}`
      )

      this.relatedProducts = relatedProducts || []
    },
    async handleWatch() {
      this.watchForm.error = false
      this.watchForm.loading = true
      this.watchForm.sent = false

      try {
        await this.$axios.$post(`/watch/product/${this.product.ID}`, {
          email: this.watchForm.email,
        })
      } catch {
        this.watchForm.error = true
      } finally {
        this.watchForm.loading = false
        this.watchForm.sent = true
        this.watchForm.email = ''
        this.$refs.watchForm.resetValidation()
      }
    },
    async handlePricesMonthClick(months) {
      if (this.pricesMonths === months) {
        return
      }
      this.pricesMonths = months
      await this.getPrices()
    },
    inStockAnywhere(stocks) {
      for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].InStock) {
          return true
        }
      }
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.price-chart-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>
