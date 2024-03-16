// filename: ymind.mjs
import { resolve } from 'path'
import { createResolver, defineNuxtModule, type Resolver } from '@nuxt/kit'

export const name = 'nuxt-content-ymind'

export default defineNuxtModule({
  meta: {
    name,
    version: '0.0.1',
    configKey: 'nuxtContentYmind',
    compatibility: { nuxt: '^3.0.0' }
  },
  setup (_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Set up Nitro externals for .tex content transformation.
    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []
    nuxt.options.nitro.externals.inline.push(resolver.resolve('.'))

    // @ts-ignore
    // Register a hook to modify content context and add a transformer for .tex files.
    nuxt.hook('content:context', (contentContext) => {
      contentContext.transformers.push(resolver.resolve('transformer.ts'))
    })
  }
})