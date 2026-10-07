import MediaReel from './MediaReel';
import StatementPoster from './StatementPoster';
import EditorialPhoto from './EditorialPhoto';
import EditorialText from './EditorialText';
import HorizontalLookbook from './HorizontalLookbook';
import { salonImages } from '../content/salonImages';

const services = [
  {
    id: 1,
    title: 'Cut',
    image: salonImages.services.cut,
    caption: 'Precise shapes, lived-in layers, fringe work and small adjustments.',
  },
  {
    id: 2,
    title: 'Color',
    image: salonImages.services.color,
    caption: 'Gloss, toning, dimensional blondes and rich brunettes, with a soft grow-out.',
  },
  {
    id: 3,
    title: 'Style',
    image: salonImages.services.style,
    caption: 'Editorial finishing, event styling, blowouts, and texture with movement.',
  },
];

function PhotoshootReels() {
  return (
    <section className="reels" aria-label="Photoshoot reels">
      <div className="section-heading section-heading--reels">
        <p>Reels</p>
        <h2>Small flashes from the chair.</h2>
      </div>
      <div className="reel-grid">
        {salonImages.reels.map((reel) => (
          <MediaReel
            key={reel.src}
            src={reel.src}
            posterImage={reel.image}
            label={reel.label}
            width={reel.width}
            height={reel.height}
          />
        ))}
      </div>
    </section>
  );
}

function BehindTheChair() {
  return (
    <section className="fullscreen-reel" aria-label="Behind the chair at ID Hairstudio" data-scroll-scene>
      <div className="chair-feature">
        <EditorialPhoto image={salonImages.behindTheChair} sizes="(max-width: 780px) 100vw, 60vw" className="chair-photo" />
        <div className="fullscreen-reel__caption">
          <p>In the chair</p>
          <h2>The hands<br />behind<br />the hair.</h2>
        </div>
      </div>
    </section>
  );
}

export default function ContentSection() {
  return (
    <>
      <section className="intro" id="studio" data-scroll-scene>
        <p className="intro__label">The salon</p>
        <EditorialText lines={['A studio for cuts', 'and color, with', 'attention to the', 'small details.']} />
        <p className="intro__body">
          We talk through what you want and work with precision, so your hair still feels natural
          after you leave the chair.
        </p>
        <div className="studio-atmosphere">
          {salonImages.atmosphere.map((image, index) => (
            <EditorialPhoto key={image.src} image={image} sizes={index === 0 ? '(max-width: 780px) 85vw, 60vw' : '(max-width: 780px) 62vw, 32vw'} />
          ))}
        </div>
      </section>

      <HorizontalLookbook />

      <StatementPoster />

      <BehindTheChair />

      <section className="services" id="services">
        <div className="section-heading">
          <p>Menu</p>
          <h2>Cuts, color and styling.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <EditorialPhoto image={service.image} sizes="(max-width: 780px) 44vw, 32vw" />
              <span>0{service.id}</span>
              <h3>{service.title}</h3>
              <p>{service.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <PhotoshootReels />

      <section className="split-feature" id="booking">
        <div>
          <p className="intro__label">Appointments</p>
          <EditorialText mode="words">Book a chair. Bring your reference.</EditorialText>
        </div>
        <div className="booking-panel">
          <p>
            Your first visit starts with a consultation. We'll talk about the shape and finish,
            and how to look after your hair.
          </p>
          <a
            href="https://wa.me/351926117055?text=Hi%20id%20studio%2C%20I%27d%20like%20to%20request%20a%20booking."
            target="_blank"
            rel="noreferrer"
          >
            <span>Book on WhatsApp</span>
          </a>
        </div>
      </section>
    </>
  );
}
