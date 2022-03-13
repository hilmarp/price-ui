<template>
  <v-autocomplete
    v-model="searchModel"
    :search-input.sync="searchInput"
    :loading="acLoading"
    :items="searchItems"
    :dense="dense"
    :placeholder="searchPlaceholder"
    item-text="Title"
    item-value="Slug"
    background-color="#fff"
    light
    color="#000"
    full-width
    hide-no-data
    no-filter
    rounded
    hide-details
    clearable
    @keydown="handleSearchKeydown"
  >
    <template #append-item>
      <v-list-item
        v-show="showMoreResultsLink"
        :to="`/search?value=${searchInput}`"
        nuxt
      >
        <v-list-item-content>
          <span class="text-center"> Sjá allar niðurstöður </span>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template #item="data">
      <v-list-item-avatar>
        <v-img :src="data.item.MainImgURL" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <div class="search-item-title">
            {{ data.item.Title }}
          </div>
        </v-list-item-title>
        <v-list-item-subtitle class="text--primary">
          {{ data.item.Price }} kr.
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import {
  AUTOCOMPLETE_TOTAL_SEARCH_RESULTS,
  SEARCH_PLACEHOLDER,
} from '../utils/constants'
import { getPrettyPrice } from '../utils/formatters'

export default {
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      acLoading: false,
      searchInput: null,
      searchModel: null,
      timeoutId: null,
      searchItems: [],
    }
  },
  computed: {
    showMoreResultsLink() {
      if (this.searchItems.length < AUTOCOMPLETE_TOTAL_SEARCH_RESULTS) {
        return false
      }

      return true
    },
    searchPlaceholder() {
      return SEARCH_PLACEHOLDER
    },
  },
  watch: {
    searchInput(val) {
      if (!val) {
        this.searchItems = []
        return
      }

      if (val.length <= 1) {
        return
      }

      this.searchDebounced(val)
    },
    searchModel(val) {
      if (!val) {
        return
      }

      this.$router.push({ path: `/product/${val}` })
    },
  },
  methods: {
    searchDebounced(val) {
      clearTimeout(this.timeoutId)

      this.acLoading = true

      this.timeoutId = setTimeout(() => {
        this.$axios
          .$get(
            `/search?limit=${AUTOCOMPLETE_TOTAL_SEARCH_RESULTS}&value=${val}`
          )
          .then((res) => {
            if (!res) {
              this.searchItems = []
              return
            }

            this.searchItems = res.map((item) => {
              return {
                ...item,
                Price: getPrettyPrice(item.Price),
              }
            })
          })
          .finally(() => {
            this.acLoading = false
          })
      }, 500)
    },
    handleSearchKeydown(e) {
      if (e.keyCode === 13 && this.searchInput) {
        this.$router.push({
          path: '/search',
          query: { value: this.searchInput },
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.search-item-title {
  position: relative;

  &__logo {
    position: absolute;
    margin-left: 10px;
  }
}
</style>
