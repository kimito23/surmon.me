import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isServer, isSPA } from '/@/enverionment'
import { useGlobalState } from '/@/state'
import { useStore, getNamespace, Modules } from '/@/store'
import { useI18n } from '/@/services/i18n'
import { useTheme, Theme } from '/@/services/theme'
import { useLoading } from '/@/services/loading'
import { useDefer } from '/@/services/defer'
import { usePopup } from '/@/services/popup'
import { useGtag } from '/@/services/gtag'
import { Language } from '/@/language/data'
import { OptionModuleGetters, AD_CONFIG } from '/@/store/option'

let isFirstScreenHydrated = false
export const onPreFetch = (fetcher: () => Promise<any>, data: any) => {
  if (isSPA) {
    onBeforeMount(fetcher)
    return data
  }
  // SSR -> Server
  if (isServer) {
    return fetcher().then(() => data)
  }
  // SSR -> Client
  // 也许需要：onServerPrefetch https://github.com/vuejs/composition-api/pull/198/files
  if (!isFirstScreenHydrated) {
    isFirstScreenHydrated = true
  } else {
    onBeforeMount(fetcher)
  }
  return data
}

export const useEnhancer = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  const globalState = useGlobalState()
  const i18n = useI18n()
  const theme = useTheme()
  const defer = useDefer()
  const popup = usePopup()
  const gtag = useGtag()
  const loading = useLoading()

  const isMobile = computed(() => globalState.userAgent.isMobile)
  const isDarkTheme = computed(() => theme.theme.value === Theme.Dark)
  const isZhLang = computed(() => i18n.language.value === Language.Zh)
  const adConfig = computed<AD_CONFIG>(() => store.getters[
    getNamespace(Modules.Option, OptionModuleGetters.ADConfig
  )])

  return {
    store,
    route,
    router,
    globalState,
    i18n,
    theme,
    defer,
    popup,
    gtag,
    adConfig,
    loading,
    isMobile,
    isDarkTheme,
    isZhLang
  }
}
