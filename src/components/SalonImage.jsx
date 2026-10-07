// Shared responsive sources; each photograph keeps its own focal point and alt.
export default function SalonImage({ image, sizes, priority = false, className = '' }) {
  return (
    <img
      className={`salon-image ${className}`}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      alt={image.alt}
      width={image.width}
      height={image.height}
      style={{ '--image-position': image.position, '--image-mobile-position': image.mobilePosition || image.position }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
