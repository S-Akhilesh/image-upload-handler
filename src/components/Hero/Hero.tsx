import './Hero.css';

export function Hero() {
  return (
    <header className='hero'>
      <div className='hero-copy'>
        <p className='hero-chip'>Picsee × Cloudinary</p>
        <h1>Drop. Upload. Deliver.</h1>
        <p className='subtitle'>
          JPG, PNG, GIF, or WebP — up to 10 images. Drag, drop, done.
        </p>
      </div>

      <ul className='hero-highlights'>
        <li>
          <span className='icon-bubble' aria-hidden='true'>
            ⚡
          </span>
          <span>Instant previews</span>
        </li>
        <li>
          <span className='icon-bubble' aria-hidden='true'>
            ☁️
          </span>
          <span>Unsigned uploads</span>
        </li>
        <li>
          <span className='icon-bubble' aria-hidden='true'>
            🪄
          </span>
          <span>Optimized delivery</span>
        </li>
      </ul>
    </header>
  );
}
