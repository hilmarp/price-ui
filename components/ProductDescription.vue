<template>
  <div>{{ shortDescription }}</div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: '',
    },
    descriptionLength: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    shortDescription() {
      if (this.description.length < this.descriptionLength) {
        return this.description
      }

      return this.description.substring(0, this.descriptionLength) + '...'
    },
  },
}
</script>
