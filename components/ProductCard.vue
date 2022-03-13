<template>
  <v-card :to="`/product/${product.Slug}`" nuxt hover>
    <v-img :src="product.MainImgURL" :height="`${imgHeight}px`">
      <div class="fill-height ma-0 img-extras">
        <div>
          <logo :source="product.Source" class="mt-3 ml-3" />
        </div>
        <div>
          <v-chip v-if="product.OnSale" color="success mb-3 mr-3">
            Tilboð
            <v-icon right small>mdi-percent</v-icon>
          </v-chip>
        </div>
      </div>
    </v-img>
    <v-card-title>{{ product.Title }}</v-card-title>
    <v-card-text>
      <div class="mt-2">
        <product-description
          :description="product.Description"
          :description-length="descriptionLength"
        />
      </div>
      <div class="mt-4 text-h6 text--primary">
        {{ price }} kr.
        <span v-if="prevPrice">
          <v-icon v-if="prevPrice >= product.Price" color="success"
            >mdi-arrow-down</v-icon
          >
          <v-icon v-if="prevPrice < product.Price" color="error"
            >mdi-arrow-up</v-icon
          >
        </span>
      </div>
      <div v-if="prevPrice" class="mt-2 text-h6 old-price">
        {{ prettyPrevPrice }} kr.
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { getPrettyPrice } from '../utils/formatters'
import ProductDescription from './ProductDescription'
import Logo from './Logo'

export default {
  components: {
    ProductDescription,
    Logo,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
    imgHeight: {
      type: Number,
      default: 250,
    },
    descriptionLength: {
      type: Number,
      default: 200,
    },
    prevPrice: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    price() {
      return getPrettyPrice(this.product.Price)
    },
    prettyPrevPrice() {
      return getPrettyPrice(this.prevPrice)
    },
    logoWidth() {
      if (
        this.product.Source === 'ht.is' ||
        this.product.Source === 'rafha.is' ||
        this.product.Source === 'computer.is'
      ) {
        return 100
      }

      return 50
    },
  },
}
</script>

<style lang="scss" scoped>
.old-price {
  text-decoration: line-through;
}

.img-extras {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div:last-child {
    align-self: flex-end;
  }
}
</style>
