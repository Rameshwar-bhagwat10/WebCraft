/**
 * App Icon Generation
 * Dynamically generates favicon/app icon
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 */

import { ImageResponse } from 'next/og';

// Icon metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'white',
          }}
        >
          W
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
