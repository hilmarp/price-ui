import { TOTAL_POPULAR_PRODUCTS } from '../utils/constants'

export const state = () => ({
  products: [],
  page: 1,
})

export const mutations = {
  setProducts(state, products) {
    state.products = products
  },
  setPage(state, page) {
    state.page = parseInt(page, 10)
  },
}

export const actions = {
  async getProducts({ state, commit }) {
    commit('setLoading', true, { root: true })

    // Calculate offset based on page
    let offset = 0
    if (state.page > 1) {
      offset = TOTAL_POPULAR_PRODUCTS * state.page - TOTAL_POPULAR_PRODUCTS
    }

    let products = []
    const plusOne = TOTAL_POPULAR_PRODUCTS + 1 // to see if we have a next page
    products = await this.$axios.$get(
      `/products/popular?limit=${plusOne}&offset=${offset}`
    )

    commit('setProducts', products || [])
    commit('setLoading', false, { root: true })
  },
}
