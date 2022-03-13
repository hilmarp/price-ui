import { TOTAL_CATEGORY_PRODUCTS } from '../utils/constants'

export const state = () => ({
  categorySlug: '',
  categoryChildren: [],
  allCategories: [],
  products: [],
  page: 1,
  orderBy: '',
  orderByDir: '',
})

export const mutations = {
  setCategorySlug(state, slug) {
    state.categorySlug = slug
  },
  setCategoryChildren(state, children) {
    state.categoryChildren = children
  },
  setAllCategories(state, categories) {
    state.allCategories = categories
  },
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
      offset = TOTAL_CATEGORY_PRODUCTS * state.page - TOTAL_CATEGORY_PRODUCTS
    }

    let products = []
    const plusOne = TOTAL_CATEGORY_PRODUCTS + 1 // to see if we have a next page
    const filters = `?limit=${plusOne}&offset=${offset}&categories=${
      state.categorySlug
    }&order_by=${state.orderBy || ''}&order_by_dir=${state.orderByDir || ''}`

    products = await this.$axios.$get(`/products${filters}`)

    commit('setProducts', products || [])
    commit('setLoading', false, { root: true })
  },
  async getCategoryChildren({ state, commit }) {
    let categories = []
    categories = await this.$axios.$get(
      `/categories?parent=${state.categorySlug}`
    )

    commit('setCategoryChildren', categories)
  },
  async getAllCategories({ commit }) {
    let categories = []
    categories = await this.$axios.$get('/categories')
    categories = categories.filter((cat) => cat.Slug !== '')
    categories = categories.map((cat) => ({ ...cat, children: [] }))

    commit('setAllCategories', categories)
  },
  async getAllCategoryChildren({ state, commit }, parent) {
    let children = []
    children = await this.$axios.$get(`/categories?parent=${parent}`)

    const categoriesClone = state.allCategories.map((c) => Object.assign({}, c))

    for (let i = 0; i < categoriesClone.length; i++) {
      if (categoriesClone[i].Slug === parent) {
        categoriesClone[i].children = children
        break
      }
    }

    commit('setAllCategories', categoriesClone)
  },
}
