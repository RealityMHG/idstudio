// Geometric lettering based on the supplied ID HAIR STUDIO reference.
// Outlines keep the logo independent of the site's editorial typefaces.
export default function BrandWordmark() {
  return (
    <svg className="brand-wordmark" viewBox="0 0 840 144" fill="none" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M4 24h18v104H4z" />
        <path fillRule="evenodd" d="M36 24h33c34 0 51 20 51 52s-17 52-51 52H36V24Zm20 19v66h12c21 0 32-12 32-33S89 43 68 43H56Z" />
      </g>
      <g transform="translate(38 0)">
        <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="butt" strokeLinejoin="round">
          <path d="M150 24v104m0-37c0-18 11-29 28-29s28 11 28 29v37" />
          <circle cx="260" cy="95" r="33" />
          <path d="M293 62v66M318 65v63M346 65v63m0-37c0-18 14-29 35-28" />
          <g transform="translate(-18 0)">
            <path d="M462 72c-8-9-18-11-26-9-9 2-16 7-16 16 0 11 12 15 22 18s20 8 20 18c0 9-8 14-20 14-11 0-21-5-27-12" />
            <path d="M492 24v79c0 17 6 25 23 25m-40-63h40M544 65v35c0 18 11 29 29 29s29-11 29-29V65" />
            <circle cx="658" cy="95" r="33" />
            <path d="M691 24v104M718 65v63" />
            <circle cx="779" cy="95" r="33" />
          </g>
        </g>
        <g fill="currentColor">
          <circle cx="318" cy="43" r="5" />
          <circle cx="718" cy="43" r="5" transform="translate(-18 0)" />
        </g>
      </g>
    </svg>
  );
}
