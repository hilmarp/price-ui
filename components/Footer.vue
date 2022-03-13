<template>
  <v-footer app :absolute="absolute" dark inset>
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-icon class="mr-3">mdi-chart-line</v-icon>
          <span>Verð frá</span>
        </v-col>
        <v-col cols="12" md="4">
          <v-row justify="center" align="center">
            <v-col cols="12" md="auto">
              <v-btn to="/help" nuxt dark text small>Hjálp</v-btn>
            </v-col>
            <v-col cols="12" md="auto">
              <v-btn to="/help" nuxt dark text small>Hafa samband</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-md-right">
            <span v-if="product" class="grey--text text-caption">
              Síðast uppfært: {{ updatedAt }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { getPrettyDate } from '../utils/formatters'

export default {
  props: {
    absolute: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      product: null,
    }
  },
  computed: {
    updatedAt() {
      if (!this.product) {
        return ''
      }

      return getPrettyDate(this.product.UpdatedAt, true, true)
    },
  },
  mounted() {
    this.getLastUpdatedProduct()
  },
  methods: {
    async getLastUpdatedProduct() {
      const product = await this.$axios.$get('/products/last-updated')
      this.product = product
    },
  },
}
</script>
