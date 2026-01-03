/**
 * Twitter Card Image Generation
 * Dynamically generates Twitter card image
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

import { ImageResponse } from 'next/og';

import { siteConfig } from '@/config/site';

// Image metadata
export const alt = 'WebCraft - Professional Web Development';
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = 'image/png';

// Image generation (same as OG but with Twitter dimensions)
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(249, 115, 22, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.1)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 90,
            height: 90,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)',
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: 'white',
            }}
          >
            W
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#171717',
            marginBottom: 16,
          }}
        >
          {siteConfig.name}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#525252',
            marginBottom: 30,
          }}
        >
          Professional Web Development Services
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#737373',
          }}
        >
          High-performance websites that drive results
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
