<template>
  <v-container>
    <h1 class="text-h5 mt-4">Flokkar</h1>
    <v-row class="mt-2 pb-5" dense>
      <v-col
        v-for="category in categories"
        :key="category.ID"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <ul>
          <li>
            <nuxt-link
              :to="`/categories/${category.Slug}`"
              class="hover-underline text--primary text-capitalize"
              >{{ category.Name }}</nuxt-link
            >
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: 'Vörur',
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories.allCategories
    },
  },
  async mounted() {
    if (this.categories.length) {
      return
    }

    await this.$store.dispatch('categories/getAllCategories')
  },
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hover-underline {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
