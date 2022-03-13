<template>
  <v-simple-table>
    <tbody>
      <tr v-for="spec in specs" :key="spec.ID">
        <td>
          <span class="text--secondary">{{ spec.Key }}</span>
        </td>
        <td>
          <v-icon
            v-if="
              spec.Value.toLowerCase() === 'já' ||
              spec.Value.toLowerCase() === 'nei'
            "
            right
            small
            :color="getIconClass(spec.Value.toLowerCase())"
            >mdi-close-circle</v-icon
          >
          <span :class="getTextClass(spec.Value.toLowerCase())">
            {{ spec.Value }}
          </span>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    specs: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  methods: {
    getIconClass(val) {
      if (val === 'já') {
        return 'success'
      }

      if (val === 'nei') {
        return 'error'
      }

      return ''
    },
    getTextClass(val) {
      if (val === 'já') {
        return 'success--text'
      }

      if (val === 'nei') {
        return 'error--text'
      }

      return ''
    },
  },
}
</script>
