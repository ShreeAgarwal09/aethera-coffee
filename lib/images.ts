export const IMAGES = {
  hero: '/images/hero/hero-main.jpg',
  heroAlt: '/images/hero/hero-alt.jpg',
  beans: '/images/hero/beans.jpg',
  beansMacro: '/images/hero/beans-macro.jpg',
  beansDark: '/images/hero/beans-dark.jpg',
  pour: '/images/hero/pour.jpg',
  espresso: '/images/hero/espresso.jpg',
  espressoPour: '/images/hero/espresso-pour.jpg',
  cafe: '/images/hero/cafe.jpg',
  cafeInterior: '/images/hero/cafe-interior.jpg',
  farmer: '/images/story/farmer.jpg',
  harvest: '/images/story/harvest.jpg',
  plantation: '/images/story/plantation.jpg',
  drying: '/images/story/drying.jpg',
  mistyPlantation: '/images/story/misty-plantation.jpg',
  roaster: '/images/lifestyle/roaster.jpg',
  roasting: '/images/story/roasting.jpg',
  cooling: '/images/story/cooling.jpg',
  packaging: '/images/lifestyle/packaging.jpg',
  coffeeBag: '/images/products/coffee-bag.jpg',
  coffeeBag2: '/images/products/coffee-bag-2.jpg',
  coffeeBag3: '/images/products/coffee-bag-3.jpg',
  cupMinimal: '/images/story/cup-minimal.jpg',
  cupTop: '/images/lifestyle/cup-top.jpg',
  cupEspresso: '/images/lifestyle/cup-espresso.jpg',
  cupSteam: '/images/lifestyle/cup-steam.jpg',
  latte: '/images/lifestyle/latte.jpg',
  pourMoka: '/images/lifestyle/pour-moka.jpg',
  teaFields: '/images/lifestyle/tea-fields.jpg',
  // Instagram-style gallery
  insta1: '/images/gallery/insta-1.jpg',
  insta2: '/images/gallery/insta-2.jpg',
  insta3: '/images/gallery/insta-3.jpg',
  insta4: '/images/gallery/insta-4.jpg',
  insta5: '/images/gallery/insta-5.jpg',
  insta6: '/images/gallery/insta-6.jpg',
};

export const COLLECTION_IMAGES: Record<string, string> = {
  'single-origin': '/images/collections/single-origin.jpg',
  'signature-blends': '/images/collections/signature-blends.jpg',
  'reserve': '/images/collections/reserve.jpg',
  'decaf': '/images/collections/decaf.jpg',
};

export const PRODUCT_IMAGES: Record<string, string> = {
  'highland-mist': '/images/products/product-1.jpg',
  'volcan-negro': '/images/products/product-2.jpg',
  'aurora-blend': '/images/products/product-3.jpg',
  'midnight-reserve': '/images/products/product-4.jpg',
  'coastal-decaf': '/images/products/product-5.jpg',
  'solstice-blend': '/images/products/product-6.jpg',
  'cerro-azul': '/images/products/product-7.jpg',
  'eclipse-reserve': '/images/products/product-8.jpg',
};

export function getProductImage(slug: string, fallback?: string | null): string {
  return PRODUCT_IMAGES[slug] ?? fallback ?? IMAGES.coffeeBag;
}
