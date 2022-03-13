export default {
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Verð frá',
    title: 'Vöruleit, verðsaga, verðbreytingar',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#1976d2' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Leitaðu eftir vefslóð, vöruheiti, lýsingu eða vörunúmeri og sjáðu niðurstöður frá mörgum vefverslunum í einu, verðsögu aftur í tímann eða fáðu tilkynningu þegar vara lækkar í verði',
      },
      // og:
      { name: 'og:type', content: 'website' },
      { name: 'og:site_name', content: 'Verð frá' },
      { name: 'og:locale', content: 'is_is' },
      { name: 'og:url', content: 'https://verdfra.is' },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Vöruleit, verðsaga, verðbreytingar - Verð frá',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          'Leitaðu eftir vefslóð, vöruheiti, lýsingu eða vörunúmeri og sjáðu niðurstöður frá mörgum vefverslunum í einu, verðsögu aftur í tímann eða fáðu tilkynningu þegar vara lækkar í verði',
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: 'https://verdfra.is/oled_search.png',
      },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/custom.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',

    // Google Analytics
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-167343786-1',
      },
    ],

    // Google AdSense
    [
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-7977902336856342',
      },
    ],

    // Vuetify.js
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'https://api.verdfra.is',
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/css/variables.scss'],
  },
  /*
   ** Server configuration
   */
  server: {
    port: 3004,
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
