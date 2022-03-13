import { TOTAL_PRICE_CHANGES } from '../utils/constants'

export const state = () => ({
  products: [],
  page: 1,
  priceType: 'drop',
})

export const mutations = {
  setProducts(state, products) {
    state.products = products
  },
  setPage(state, page) {
    state.page = parseInt(page, 10)
  },
  setPriceType(state, priceType) {
    state.priceType = priceType
  },
}

export const actions = {
  async getProducts({ state, commit }) {
    commit('setLoading', true, { root: true })

    // Calculate offset based on page
    let offset = 0
    if (state.page > 1) {
      offset = TOTAL_PRICE_CHANGES * state.page - TOTAL_PRICE_CHANGES
    }

    let products = []
    const plusOne = TOTAL_PRICE_CHANGES + 1 // to see if we have a next page

    const baseUrl = `/products/price-changes?limit=${plusOne}&offset=${offset}`
    let url = baseUrl

    // What to show, price hike/drop
    if (state.priceType === 'drop_hike') {
      url = baseUrl
    } else if (state.priceType === 'hike') {
      url = `${url}&lower=false`
    } else if (state.priceType === 'drop') {
      url = `${url}&lower=true`
    }

    products = await this.$axios.$get(url)

    commit('setProducts', products || [])
    commit('setLoading', false, { root: true })
  },
}
