import { TOTAL_SALE_PRODUCTS } from '../utils/constants'

export const state = () => ({
  products: [],
  page: 1,
  orderBy: '',
  orderByDir: '',
})

export const mutations = {
  setProducts(state, products) {
    state.products = products
  },
  setPage(state, page) {
    state.page = parseInt(page, 10)
  },
  setOrderBy(state, orderBy) {
    state.orderBy = orderBy
  },
  setOrderByDir(state, orderByDir) {
    state.orderByDir = orderByDir
  },
}

export const actions = {
  async getProducts({ state, commit }) {
    commit('setLoading', true, { root: true })

    // Calculate offset based on page
    let offset = 0
    if (state.page > 1) {
      offset = TOTAL_SALE_PRODUCTS * state.page - TOTAL_SALE_PRODUCTS
    }

    let products = []
    const plusOne = TOTAL_SALE_PRODUCTS + 1 // to see if we have a next page
    const filters = `?on_sale=true&limit=${plusOne}&offset=${offset}&order_by=${
      state.orderBy || ''
    }&order_by_dir=${state.orderByDir || ''}`
    products = await this.$axios.$get(`/products${filters}`)

    commit('setProducts', products || [])
    commit('setLoading', false, { root: true })
  },
}
