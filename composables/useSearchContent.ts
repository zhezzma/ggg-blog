import { useFuse } from '@vueuse/integrations/useFuse'

export default async function useSearchContent(search: Ref<string>) {
  const runtimeConfig = useRuntimeConfig()
  const { integrity, api } = runtimeConfig.public.content

  const { data } = await useFetch(`${api.baseURL}/search${integrity ? '.' + integrity : ''}.json`)

  const { results } = useFuse(search, data as any)

  return results
}