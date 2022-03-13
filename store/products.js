import { TOTAL_ALL_PRODUCTS } from '../utils/constants'
import { capitalize } from '../utils/formatters'

export const state = () => ({
  products: [],
  page: 1,
  orderBy: '',
  orderByDir: '',
  categories: [],
  openCategories: [],
  selectedCategories: [],
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
  setCategories(state, categories) {
    state.categories = categories
  },
  setOpenCategories(state, categories) {
    state.openCategories = categories
  },
  setSelectedCategories(state, categories) {
    state.selectedCategories = categories
  },
}

export const actions = {
  async getProducts({ state, commit }) {
    commit('setLoading', true, { root: true })

    const slugs = state.selectedCategories.map((c) => c.Slug)

    // Calculate offset based on page
    let offset = 0
    if (state.page > 1) {
      offset = TOTAL_ALL_PRODUCTS * state.page - TOTAL_ALL_PRODUCTS
    }

    let products = []
    const plusOne = TOTAL_ALL_PRODUCTS + 1 // to see if we have a next page

    let filters = `?limit=${plusOne}&offset=${offset}&order_by=${state.orderBy}&order_by_dir=${state.orderByDir}`

    if (slugs.length > 0) {
      filters += `&categories=${slugs.join(',')}`
    }

    products = await this.$axios.$get(`/products${filters}`)

    commit('setProducts', products || [])
    commit('setLoading', false, { root: true })
  },
  async getCategories({ state, commit }, parent) {
    commit('setLoading', true, { root: true })

    // Get the categories
    let categories = await this.$axios.$get(
      `/categories?parent=${parent || ''}`
    )

    // Add children key
    categories = categories.map((c) => ({
      ...c,
      Name: capitalize(c.Name),
      children: [],
    }))

    // If no parent it's level one, so just set categories
    if (!parent) {
      commit('setCategories', categories)
    }

    // If there is a parent, we have to find the parent and set these categories as its children
    if (state.categories.length > 0 && parent) {
      const setChildren = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].Slug === parent) {
            if (categories.length === 0) {
              delete arr[i].children
              continue
            }

            arr[i].children = categories || []
            continue
          }

          if (arr[i].children) {
            arr[i].children = arr[i].children.map((c) => Object.assign({}, c))
            setChildren(arr[i].children)
          }
        }
      }

      const categoriesClone = state.categories.map((c) => Object.assign({}, c))
      setChildren(categoriesClone)
      commit('setCategories', categoriesClone)
    }

    commit('setLoading', false, { root: true })
  },
  // getSetSelectedCategories will load categories if they're not found and then set them
  async getSetSelectedCategories({ state, commit, dispatch }, payload) {
    if (state.categories.length === 0) {
      await dispatch('getCategories')
    }

    if (payload.onMount) {
      // Split up all categories needed
      // formkokur]bokunarvorur]busahold
      // bokunarvorur]busahold
      // busahold
      const parentCategoriesSet = new Set()
      for (let i = 0; i < payload.categories.length; i++) {
        const slugs = payload.categories[i].split(']')
        let now = ''
        for (let j = slugs.length - 1; j >= 0; j--) {
          now = `${now}${now ? ']' : ''}${slugs[j]}`
          parentCategoriesSet.add(now.split(']').reverse().join(']'))
        }
      }

      // Load categories, if they're not already loaded
      const parentCategories = Array.from(parentCategoriesSet)
      parentCategories.sort((a, b) => {
        return a.split(']').length - b.split(']').length
      })

      const parentCategoriesToLoadSet = new Set()
      for (let i = 0; i < parentCategories.length; i++) {
        if (parentCategories[i].split(']').length <= 1) {
          // First level will already be loaded, see top of function
          continue
        }

        const parentCategory = parentCategories[i].split(']')
        parentCategory.shift()
        parentCategoriesToLoadSet.add(parentCategory.join(']'))
      }

      const loadChildren = async (categories) => {
        for (let i = 0; i < categories.length; i++) {
          if (parentCategoriesToLoadSet.has(categories[i].Slug)) {
            if (categories[i].children.length === 0) {
              await dispatch('getCategories', categories[i].Slug)
              await loadChildren(state.categories)
            } else {
              await loadChildren(state.categories[i].children)
            }
          }
        }
      }
      await loadChildren(state.categories)
    }

    // Get parents to loop through
    const parentsSet = new Set()
    for (let i = 0; i < payload.categories.length; i++) {
      const slugs = payload.categories[i].split(']')
      parentsSet.add(slugs[slugs.length - 1])
    }

    // Loop through categories and children and add them to the selected category list
    const selCategories = []
    const getCategoryBySlug = (categories, parentLoop) => {
      for (let i = 0; i < categories.length; i++) {
        if (parentLoop && !parentsSet.has(categories[i].Slug)) {
          continue
        }

        if (payload.categories.includes(categories[i].Slug)) {
          selCategories.push(categories[i])
        }

        if (categories[i].children) {
          getCategoryBySlug(categories[i].children, false)
        }
      }
    }
    getCategoryBySlug(state.categories, true)

    commit('setSelectedCategories', selCategories)
  },
}
