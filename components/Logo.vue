<template>
  <div :class="divClass" class="logo">
    <img
      v-if="source === 'elko.is'"
      src="~assets/img/elko.svg"
      alt="Elko logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'ht.is'"
      src="~assets/img/ht.png"
      alt="Heimilistæki logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'rafha.is'"
      src="~assets/img/rafha.png"
      alt="Rafha logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'rafland.is'"
      src="~assets/img/rafland.png"
      alt="Rafland logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'computer.is'"
      src="~assets/img/computer.png"
      alt="Computer logo"
      :style="`width: ${width}px;`"
    />

    <img
      v-if="source === 'ormsson.is'"
      src="~assets/img/ormsson.png"
      alt="Ormsson logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'utilif.is'"
      src="~assets/img/utilif.png"
      alt="Útilíf logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'epal.is'"
      src="~assets/img/epallogo.png"
      alt="Epal logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'heimkaup.is'"
      src="~assets/img/heimkaup-logo.svg"
      alt="Heimkaup logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'byko.is'"
      src="~assets/img/Byko.svg"
      alt="Byko logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'tl.is'"
      src="~assets/img/tl-logo.png"
      alt="Tölvulistinn logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'spilavinir.is'"
      src="~assets/img/spilavinir.png"
      alt="Spilavinir logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'nexus.is'"
      src="~assets/img/nexus-header.png"
      alt="Nexus logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'rumfatalagerinn.is'"
      src="~assets/img/rfl-logo-web.svg"
      alt="Rúmfatalagerinn logo"
      :style="`width: ${width}px;`"
    />
    <img
      v-if="source === 'penninn.is'"
      src="~assets/img/pen_eymundsson_logo.svg"
      alt="Penninn logo"
      :style="`width: ${width}px;`"
    />
  </div>
</template>

<script>
export default {
  props: {
    source: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 60,
    },
  },
  computed: {
    divClass() {
      switch (this.source) {
        case 'elko.is':
          return 'elko-logo'
        case 'ht.is':
          return 'ht-logo'
        case 'rafha.is':
          return 'rafha-logo'
        case 'rafland.is':
          return 'rafland-logo'
        case 'computer.is':
          return 'computer-logo'
        case 'utilif.is':
          return 'utilif-logo'
        case 'ormsson.is':
          return 'ormsson-logo'
        case 'epal.is':
          return 'epal-logo'
        case 'heimkaup.is':
          return 'heimkaup-logo'
        case 'byko.is':
          return 'byko-logo'
        case 'tl.is':
          return 'tl-logo'
        case 'spilavinir.is':
          return 'spilavinir-logo'
        case 'nexus.is':
          return 'nexus-logo'
        case 'rumfatalagerinn.is':
          return 'rumfatalagerinn-logo'
        case 'penninn.is':
          return 'penninn-logo'
        default:
          return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
}

.elko-logo {
  background-color: #000e52;
}

.ht-logo {
  background-color: #ed1c24;
}

.rafha-logo {
  background-color: #fff;
}

.rafland-logo {
  background-color: #f7f7f7;
}

.computer-logo {
  background-color: #0080c8;
}

.ormsson-logo {
  background-color: #f40507;
}

.utilif-logo {
  background-color: #e11c24;
}

.epal-logo {
  background-color: #ee3324;
}

.heimkaup-logo {
  background-color: #ca031a;
}

.byko-logo {
  background-color: #015b93;
}

.tl-logo {
  background-color: #3566a9;
}

.spilavinir-logo {
  background-color: #fff;
}

.nexus-logo {
  background-color: #fff;
}

.rumfatalagerinn-logo {
  background-color: #153b8a;
}

.penninn-logo {
  background-color: #474747;
}
</style>
