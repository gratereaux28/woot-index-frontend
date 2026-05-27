import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type Language = 'en' | 'es';

const dictionaries = {
  en: {
    'app.search': 'Search',
    'app.switchLight': 'Switch to light mode',
    'app.switchDark': 'Switch to dark mode',
    'app.backToTop': 'Back to top',
    'nav.allProducts': 'All products',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.privacy': 'Privacy',
    'nav.products': '{count} products',
    'language.title': 'Language',
    'language.english': 'English',
    'language.spanish': 'Spanish',
    'filters.title': 'Filters',
    'filters.clear': 'Clear',
    'filters.priceRange': 'Price range',
    'filters.minPrice': 'Minimum price',
    'filters.maxPrice': 'Maximum price',
    'filters.min': 'Min',
    'filters.max': 'Max',
    'filters.discount': 'Minimum discount',
    'filters.discountAny': 'Any',
    'filters.showSoldOut': 'Show sold out',
    'filters.appOnly': 'App only',
    'filters.amazonFulfilled': 'Amazon fulfilled',
    'filters.featuredOnly': 'Featured only',
    'product.featured': 'Featured',
    'product.deal': 'Woot deal',
    'product.amazonFulfilled': 'Amazon fulfilled',
    'product.wootFulfilled': 'Woot fulfilled',
    'product.noLimit': 'No limit',
    'product.max': '{count} max',
    'product.appOnly': 'App only',
    'product.soldOut': 'Sold out',
    'product.basicConfiguration': 'Basic configuration',
    'product.details': 'Details',
    'product.woot': 'Woot',
    'product.amazon': 'Amazon',
    'product.viewPrice': 'View price',
    'product.percentOff': '{value}% off',
    'product.categoryFallback': 'Woot deal',
    'time.active': 'Active',
    'time.activeFull': 'Deal active until sold out',
    'time.expired': 'Expired',
    'time.expiredFull': 'Deal expired',
    'time.minutesLeft': '{value}m left',
    'time.hoursLeft': '{value}h left',
    'time.daysLeft': '{value}d left',
    'time.daysHoursLeft': '{days}d {hours}h left',
    'time.expiresMinutes': 'Deal expires in {value}m or until sold out',
    'time.expiresHours': 'Deal expires in {value}h or until sold out',
    'time.expiresDays': 'Deal expires in {value}d or until sold out',
    'time.expiresDaysHours': 'Deal expires in {days}d {hours}h or until sold out',
    'grid.emptyTitle': 'No products match this search',
    'grid.emptyBody': 'Try another category, subcategory, or search term.',
    'grid.loadingMore': 'Loading more deals',
    'modal.conditionFallback': 'Condition not specified',
    'modal.variants': 'Variants',
    'modal.openWoot': 'Woot',
    'modal.openAmazon': 'Amazon',
    'modal.openCamelCamelCamel': 'CamelCamelCamel',
    'notFound.title': 'Page not found',
    'notFound.body': "The page you're looking for doesn't exist or may have been moved.",
    'notFound.cta': 'Back to home',
    'about.badge': 'Independent search tool',
    'about.title': 'About WootIndex',
    'about.hero':
      'WootIndex is an independent product search interface that helps you browse deals returned by our Woot product API. It is built to make categories, prices, availability, photos, and product links easier to scan in one place.',
    'about.searchTitle': 'Search and discovery',
    'about.searchBody':
      'The app indexes product data from our API so you can search deals, filter by category or subcategory, and quickly open the original Woot listing.',
    'about.purchaseTitle': 'Purchases happen on Woot',
    'about.purchaseBody':
      'WootIndex does not sell products, process payments, manage orders, or provide customer support for any purchase. External product buttons send you to Woot.',
    'about.ownershipTitle': 'Clear ownership',
    'about.ownershipBody':
      'Woot names, product images, prices, descriptions, and deal links belong to their respective owners and may change at any time.',
    'about.notAffiliatedTitle': 'Not affiliated with Woot',
    'about.notAffiliatedBody':
      'WootIndex is not affiliated with, endorsed by, sponsored by, or officially connected to Woot, Amazon, or any of their affiliates. We are only a search tool for finding and previewing products before you visit the official listing.',
    'about.verifyTitle': 'What you should verify before buying',
    'about.verifyPrice': 'Final price, shipping, taxes, and availability on the official Woot page.',
    'about.verifyStatus': 'Whether the deal is still active, sold out, app-only, or limited by quantity.',
    'about.verifyPolicy': 'Product condition, warranty, return policy, and seller details shown by Woot.',
    'privacy.updated': 'Last updated May 15, 2026',
    'privacy.title': 'Privacy',
    'privacy.hero':
      'WootIndex is a product search tool. It does not require user accounts, does not process payments, and does not intentionally collect sensitive personal information.',
    'privacy.productTitle': 'Product data',
    'privacy.productBody':
      'The app displays product titles, prices, categories, availability, images, discount details, and Woot listing links returned by the API.',
    'privacy.searchTitle': 'Search requests',
    'privacy.searchBody':
      'Searches, category filters, pagination, and sold-out preferences are sent to the app BFF so it can return matching product results.',
    'privacy.noSellTitle': 'No selling of data',
    'privacy.noSellBody':
      'We do not sell personal information. This app is designed for browsing deals, not for advertising profiles or payment collection.',
    'privacy.techTitle': 'Technical information',
    'privacy.logs':
      'Server logs may include technical metadata such as IP address, timestamps, requested URLs, browser user agent, and error details for security, debugging, and reliability.',
    'privacy.analytics':
      'We may record usage events such as page views, searches by length, selected categories, filter changes, product detail opens, external link clicks, language changes, and theme changes to understand usage and improve reliability.',
    'privacy.images':
      'Product images may load from third-party image or CDN URLs, which means your browser may request those resources directly.',
    'privacy.external':
      "When you open a Woot link, you leave WootIndex and Woot's own terms and privacy practices apply.",
    'privacy.independentTitle': 'Independent search tool',
    'privacy.independentBody':
      'WootIndex is not affiliated with, endorsed by, sponsored by, or officially connected to Woot, Amazon, or any of their affiliates. We are only a search tool that helps users find and preview product listings.',
  },
  es: {
    'app.search': 'Buscar',
    'app.switchLight': 'Cambiar a modo claro',
    'app.switchDark': 'Cambiar a modo oscuro',
    'app.backToTop': 'Volver arriba',
    'nav.allProducts': 'Todos los productos',
    'nav.categories': 'Categorías',
    'nav.about': 'Acerca de',
    'nav.privacy': 'Privacidad',
    'nav.products': '{count} productos',
    'language.title': 'Idioma',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    'filters.title': 'Filtros',
    'filters.clear': 'Limpiar',
    'filters.priceRange': 'Rango de precio',
    'filters.minPrice': 'Precio mínimo',
    'filters.maxPrice': 'Precio máximo',
    'filters.min': 'Mín',
    'filters.max': 'Máx',
    'filters.discount': 'Descuento mínimo',
    'filters.discountAny': 'Cualquiera',
    'filters.showSoldOut': 'Mostrar agotados',
    'filters.appOnly': 'Solo app',
    'filters.amazonFulfilled': 'Gestionado por Amazon',
    'filters.featuredOnly': 'Solo destacados',
    'product.featured': 'Destacado',
    'product.deal': 'Oferta Woot',
    'product.amazonFulfilled': 'Gestionado por Amazon',
    'product.wootFulfilled': 'Gestionado por Woot',
    'product.noLimit': 'Sin límite',
    'product.max': '{count} máx',
    'product.appOnly': 'Solo app',
    'product.soldOut': 'Agotado',
    'product.basicConfiguration': 'Configuración básica',
    'product.details': 'Detalles',
    'product.woot': 'Woot',
    'product.amazon': 'Amazon',
    'product.viewPrice': 'Ver precio',
    'product.percentOff': '{value}% desc.',
    'product.categoryFallback': 'Oferta Woot',
    'time.active': 'Activa',
    'time.activeFull': 'Oferta activa hasta agotarse',
    'time.expired': 'Vencida',
    'time.expiredFull': 'Oferta vencida',
    'time.minutesLeft': 'Quedan {value}m',
    'time.hoursLeft': 'Quedan {value}h',
    'time.daysLeft': 'Quedan {value}d',
    'time.daysHoursLeft': 'Quedan {days}d {hours}h',
    'time.expiresMinutes': 'La oferta vence en {value}m o hasta agotarse',
    'time.expiresHours': 'La oferta vence en {value}h o hasta agotarse',
    'time.expiresDays': 'La oferta vence en {value}d o hasta agotarse',
    'time.expiresDaysHours': 'La oferta vence en {days}d {hours}h o hasta agotarse',
    'grid.emptyTitle': 'No hay productos para esta búsqueda',
    'grid.emptyBody': 'Prueba otra categoría, subcategoría o término de búsqueda.',
    'grid.loadingMore': 'Cargando más ofertas',
    'modal.conditionFallback': 'Condición no especificada',
    'modal.variants': 'Variantes',
    'modal.openWoot': 'Woot',
    'modal.openAmazon': 'Amazon',
    'modal.openCamelCamelCamel': 'CamelCamelCamel',
    'notFound.title': 'Página no encontrada',
    'notFound.body': 'La página que buscas no existe o puede haber sido movida.',
    'notFound.cta': 'Volver al inicio',
    'about.badge': 'Buscador independiente',
    'about.title': 'Acerca de WootIndex',
    'about.hero':
      'WootIndex es una interfaz independiente de búsqueda de productos que te ayuda a explorar ofertas devueltas por nuestra API de productos de Woot. Está creada para ver categorías, precios, disponibilidad, fotos y enlaces de producto en un solo lugar.',
    'about.searchTitle': 'Búsqueda y descubrimiento',
    'about.searchBody':
      'La app indexa datos de productos desde nuestra API para que puedas buscar ofertas, filtrar por categoría o subcategoría y abrir rápidamente el listado original de Woot.',
    'about.purchaseTitle': 'Las compras ocurren en Woot',
    'about.purchaseBody':
      'WootIndex no vende productos, no procesa pagos, no gestiona pedidos y no ofrece soporte al cliente para compras. Los botones externos te envían a Woot.',
    'about.ownershipTitle': 'Propiedad clara',
    'about.ownershipBody':
      'Los nombres, imágenes, precios, descripciones y enlaces de ofertas de Woot pertenecen a sus respectivos dueños y pueden cambiar en cualquier momento.',
    'about.notAffiliatedTitle': 'Sin afiliación con Woot',
    'about.notAffiliatedBody':
      'WootIndex no está afiliado, respaldado, patrocinado ni conectado oficialmente con Woot, Amazon ni ninguno de sus afiliados. Somos solo un buscador para encontrar y previsualizar productos antes de visitar el listado oficial.',
    'about.verifyTitle': 'Qué debes verificar antes de comprar',
    'about.verifyPrice': 'Precio final, envío, impuestos y disponibilidad en la página oficial de Woot.',
    'about.verifyStatus': 'Si la oferta sigue activa, está agotada, es solo para app o está limitada por cantidad.',
    'about.verifyPolicy': 'Condición del producto, garantía, política de devolución y detalles del vendedor indicados por Woot.',
    'privacy.updated': 'Última actualización: 15 de mayo de 2026',
    'privacy.title': 'Privacidad',
    'privacy.hero':
      'WootIndex es una herramienta de búsqueda de productos. No requiere cuentas de usuario, no procesa pagos y no recopila intencionalmente información personal sensible.',
    'privacy.productTitle': 'Datos de productos',
    'privacy.productBody':
      'La app muestra títulos, precios, categorías, disponibilidad, imágenes, detalles de descuento y enlaces de listados de Woot devueltos por la API.',
    'privacy.searchTitle': 'Solicitudes de búsqueda',
    'privacy.searchBody':
      'Las búsquedas, filtros de categoría, paginación y preferencias de agotados se envían al BFF de la app para devolver productos coincidentes.',
    'privacy.noSellTitle': 'No vendemos datos',
    'privacy.noSellBody':
      'No vendemos información personal. Esta app está diseñada para explorar ofertas, no para perfiles publicitarios ni cobro de pagos.',
    'privacy.techTitle': 'Información técnica',
    'privacy.logs':
      'Los logs del servidor pueden incluir metadatos técnicos como dirección IP, fechas, URLs solicitadas, navegador y detalles de errores por seguridad, depuración y confiabilidad.',
    'privacy.analytics':
      'Podemos registrar eventos de uso como vistas de página, búsquedas por longitud, categorías seleccionadas, cambios de filtros, apertura de detalles, clicks en enlaces externos, cambios de idioma y cambios de tema para entender el uso y mejorar la confiabilidad.',
    'privacy.images':
      'Las imágenes de productos pueden cargarse desde URLs de imágenes o CDN de terceros, lo que significa que tu navegador puede solicitar esos recursos directamente.',
    'privacy.external':
      'Cuando abres un enlace de Woot, sales de WootIndex y aplican los términos y prácticas de privacidad propios de Woot.',
    'privacy.independentTitle': 'Buscador independiente',
    'privacy.independentBody':
      'WootIndex no está afiliado, respaldado, patrocinado ni conectado oficialmente con Woot, Amazon ni ninguno de sus afiliados. Somos solo un buscador que ayuda a encontrar y previsualizar listados de productos.',
  },
} as const;

export type TranslationKey = keyof typeof dictionaries.en;
type TranslationValues = Record<string, string | number>;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const storedLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  return window.localStorage.getItem('wootindex-language') === 'es' ? 'es' : 'en';
};

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(storedLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('wootindex-language', language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key, values) => {
        let message: string = dictionaries[language][key] ?? dictionaries.en[key];

        Object.entries(values ?? {}).forEach(([name, replacement]) => {
          message = message.replaceAll(`{${name}}`, String(replacement));
        });

        return message;
      },
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}
