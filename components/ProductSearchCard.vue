<template>
  <v-card :to="`/product/${product.Slug}`" nuxt hover>
    <v-row>
      <v-col :cols="12" :sm="2">
        <v-img :src="product.MainImgURL" height="100px">
          <div class="fill-height ma-0 img-extras">
            <div>
              <logo :source="product.Source" class="mt-2 ml-2" />
            </div>
            <div>
              <v-chip v-if="product.OnSale" small color="success mb-2 mr-2">
                Tilboð
                <v-icon right small>mdi-percent</v-icon>
              </v-chip>
            </div>
          </div>
        </v-img>
      </v-col>
      <v-col>
        <v-card-title>
          {{ product.Title }}
        </v-card-title>
        <v-card-text>{{ description }}</v-card-text>
      </v-col>
      <v-col :cols="12" md="auto">
        <v-card-title>{{ price }} kr.</v-card-title>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { getPrettyPrice } from '../utils/formatters'
import Logo from './Logo'

export default {
  components: {
    Logo,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  computed: {
    description() {
      if (this.product.Description.length < 400) {
        return this.product.Description
      }

      return this.product.Description.substring(0, 400) + '...'
    },
    price() {
      return getPrettyPrice(this.product.Price)
    },
    logoWidth() {
      if (
        this.product.Source === 'ht.is' ||
        this.product.Source === 'rafland.is'
      ) {
        return 55
      }

      if (
        this.product.Source === 'rafha.is' ||
        this.product.Source === 'computer.is'
      ) {
        return 65
      }

      return 35
    },
  },
}
</script>

<style lang="scss" scoped>
.img-extras {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div:last-child {
    align-self: flex-end;
  }
}
</style>
