import SalonImage from './SalonImage';

export default function EditorialPhoto({ image, sizes, className = '', caption, priority = false }) {
  return (
    <figure className={`editorial-photo ${className}`}>
      <div className="editorial-photo__frame">
        <SalonImage image={image} sizes={sizes} priority={priority} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
