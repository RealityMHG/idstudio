import media from './salon-media.json';

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

const photos = Object.fromEntries(Object.entries(media.photos).map(([name, photo]) => [name, {
  ...photo,
  src: publicAsset(`images/salon/${name}-${photo.width}.webp`),
  srcSet: photo.widths.map((width) => `${publicAsset(`images/salon/${name}-${width}.webp`)} ${width}w`).join(', '),
}]));

export const salonImages = {
  hero: photos['sculptural-blue'],
  atmosphere: [photos['studio-interior'], photos.consultation],
  gallery: [
    { image: photos['short-editorial'], title: 'A shorter statement', meta: 'Cut / editorial' },
    { image: photos['blonde-layers'], title: 'Light, lived in', meta: 'Color / movement' },
    { image: photos['braided-editorial'], title: 'Built into shape', meta: 'Braids / fashion' },
    { image: photos['runway-shapes'], title: 'Beyond the everyday', meta: 'Sculpture / backstage' },
  ],
  neon: [
    { image: photos['orange-spikes'], caption: 'Color with an edge' },
    { image: photos['blue-editorial'], caption: 'An editorial instinct' },
    { image: photos['pink-texture'], caption: 'Texture turned up' },
  ],
  services: {
    cut: photos['precision-cut'],
    color: photos['dimensional-blonde'],
    style: photos['event-waves'],
  },
  behindTheChair: photos['behind-the-chair'],
  reels: [
    { image: photos['blonde-in-progress'], src: publicAsset('videos/salon/blonde-in-progress.mp4'), label: 'A stylist finishing blonde waves in the salon', ...media.videos['blonde-in-progress'] },
    { image: photos['sculpture-in-progress'], src: publicAsset('videos/salon/sculpture-in-progress.mp4'), label: 'A stylist creating a sculptural ponytail wrapped in white cord', ...media.videos['sculpture-in-progress'] },
  ],
};
