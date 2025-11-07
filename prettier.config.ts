import type { Config } from 'prettier'

const config: Config = {
  semi: false,
  useTabs: false,
  singleQuote: true,
  printWidth: 100,
  vueIndentScriptAndStyle: true,
  singleAttributePerLine: true,
  plugins: ['prettier-plugin-tailwindcss'],
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss#specifying-your-tailwind-stylesheet-path-tailwind-css-v4
  tailwindStylesheet: './app/assets/css/main.css',
}

export default config
