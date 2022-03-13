<template>
  <v-container>
    <v-row justify="center">
      <v-col :cols="12" :lg="8" :xl="6">
        <div class="pt-5">
          <h1 class="text-h4 mb-1">Hvað er Verð frá?</h1>
          <p>
            Mögulegt að leita í
            <span v-if="prettyCount > 0" class="font-weight-medium">{{
              prettyCount
            }}</span>
            vörum frá mismunandi vefverslunum á einum stað og sjá núverandi verð
            vöru ásamt verðbreytingum aftur í tímann og fá tilkynningu um
            verðlækkun á vöru. Fleiri vefverslanir/vörur bætast við reglulega.
          </p>
        </div>
        <div class="mt-8">
          <h2 class="mb-3 text-h5">Spurt og svarað</h2>
          <v-expansion-panels hover>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Hvaðan koma vörurnar?
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                Frá íslenskum vefverslunum, fleiri bætast við reglulega
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Hversu oft eru vörur uppfærðar?
              </v-expansion-panel-header>
              <v-expansion-panel-content
                >Oftast daglega, en gæti dregist um nokkra daga í einstaka
                tilvikum</v-expansion-panel-content
              >
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Er lagerstaðan rétt?
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                Hún er uppfærð reglulega, en til að vera viss er betra að skoða
                vefsíðu verslunarinnar
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Af hverju er verðsaga bara nokkrir dagar á einstaka vörum?
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                Verðsaga fer bara eins langt aftur í tímann og þegar verdfra.is
                fann hana fyrst, gæti verið að vefverslun var nýlega bætt við
                eða þetta er ný vara
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div class="mt-10">
          <h2 class="text-h5 mb-1">Hafa samband</h2>
          <p class="text-subtitle-1">
            Ertu með ábendingar eða hugmyndir, sendu skilaboð
          </p>
          <v-alert v-if="form.error" type="error">
            Villa kom upp við að senda skilaboð
          </v-alert>
          <v-alert v-if="form.sent" type="success">
            Skilaboð voru send
          </v-alert>
          <v-form v-model="form.valid">
            <v-text-field
              v-model="form.email"
              :rules="form.emailRules"
              type="email"
              label="Netfang"
              required
              outlined
            />
            <v-textarea
              v-model="form.text"
              :rules="form.textRules"
              :counter="2048"
              label="Skilaboð"
              required
              outlined
            />
            <v-btn
              color="primary"
              :disabled="!form.valid || form.loading"
              @click.prevent="handleContact"
            >
              Senda
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getPrettyPrice } from '../utils/formatters'

export default {
  data() {
    return {
      form: {
        valid: false,
        loading: false,
        error: false,
        sent: false,
        email: '',
        text: '',
        emailRules: [
          (v) => !!v || 'Netfang vantar',
          (v) => /.+@.+/.test(v) || 'Ekki gilt netfang',
        ],
        textRules: [
          (v) => !!v || 'Skilaboð vantar',
          (v) => v.length <= 2048 || 'Skilaboð eru of löng',
        ],
      },
      productCount: 0,
    }
  },
  head() {
    return {
      title: 'Hjálp',
    }
  },
  computed: {
    prettyCount() {
      return getPrettyPrice(this.productCount)
    },
  },
  mounted() {
    this.getProductCount()
  },
  methods: {
    async handleContact() {
      this.form.error = false
      this.form.loading = true
      this.form.sent = false

      try {
        await this.$axios.$post('/contact', {
          from: this.form.email,
          message: this.form.text,
        })
      } catch {
        this.form.error = true
      } finally {
        this.form.loading = false
        this.form.sent = true
      }
    },
    async getProductCount() {
      const count = await this.$axios.$get('/products/count')
      this.productCount = count.Count
    },
  },
}
</script>
