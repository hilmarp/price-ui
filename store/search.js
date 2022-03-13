import { TOTAL_SEARCH_RESULTS } from '../utils/constants'

export const state = () => ({
  value: null,
  products: [],
  page: 1,
})

export const mutations = {
  setValue(state, val) {
    state.value = val
  },
  setProducts(state, products) {
    state.products = products
  },
  setPage(state, page) {
    state.page = parseInt(page, 10)
  },
}

export const actions = {
  async search({ state, commit }) {
    commit('setLoading', true, { root: true })

    // Calculate offset based on page
    let offset = 0
    if (state.page > 1) {
      offset = TOTAL_SEARCH_RESULTS * state.page - TOTAL_SEARCH_RESULTS
    }

    let products = []
    if (state.value) {
      const plusOne = TOTAL_SEARCH_RESULTS + 1 // to see if we have a next page
      products = await this.$axios.$get(
        `/search?value=${state.value}&limit=${plusOne}&offset=${offset}`
      )
    }

    commit('setProducts', products || [])
    commit('setLoading', false, { root: true })
  },
}
