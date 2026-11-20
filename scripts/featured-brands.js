const HOME_RECOMMENDATION_SLUGS = [
  'onlywin', 'fraga-ar', 'spinboss', 'stonevegas', 'lizaro',
  'zarbet', 'trino', 'gamblezen', '10bet', 'spinrise',
  'pinco', 'ybets', 'dazard', 'coolzino', '22bet',
  'casinado', 'magneticslots', 'goldenstar', 'moonwin', 'mrpunter',
];

export const getBrandDetailSlug = brand =>
  String(brand?.urlDetail || '')
    .replace(/^\/?brands\//i, '')
    .replace(/\.html$/i, '')
    .replace(/^\/+|\/+$/g, '');

export const getFeaturedHomeBrands = brands => {
  const brandBySlug = new Map(brands.filter(brand =>
    brand.hasDetailPage && brand.urlDetail && !brand.notRecommended && !brand.temporarilyUnavailable
  ).map(brand => [getBrandDetailSlug(brand), brand]));
  return HOME_RECOMMENDATION_SLUGS.map(slug => brandBySlug.get(slug)).filter(Boolean);
};
