import { useEffect, useRef } from 'react';

interface InstagramEmbedProps {
  postUrl: string;
  maxWidth?: number;
}

export const InstagramEmbed = ({ postUrl, maxWidth = 480 }: InstagramEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!postUrl || typeof postUrl !== 'string' || !postUrl.trim()) {
    return null;
  }

  // Clean and normalize permalink for Instagram Embed API
  const cleanUrl = postUrl.trim().split('?')[0].replace(/\/+$/, '') + '/';

  useEffect(() => {
    if (!cleanUrl) return;

    const triggerInstagramProcess = () => {
      if (typeof window !== 'undefined' && (window as any).instgrm?.Embeds?.process) {
        (window as any).instgrm.Embeds.process();
      }
    };

    const scriptId = 'instagram-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        triggerInstagramProcess();
      };
      document.body.appendChild(script);
    } else {
      // Script already loaded, trigger processing after DOM update
      const timer = setTimeout(triggerInstagramProcess, 100);
      return () => clearTimeout(timer);
    }
  }, [cleanUrl]);

  return (
    <div 
      className="instagram-embed-container" 
      ref={containerRef}
      style={{ maxWidth: `${maxWidth}px`, margin: '0 auto', width: '100%' }}
    >
      <blockquote
        key={cleanUrl}
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={cleanUrl}
        data-instgrm-version="14"
        style={{
          background: '#ffffff',
          border: '0',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(17, 20, 20, 0.06)',
          margin: '0 auto',
          maxWidth: `${maxWidth}px`,
          minWidth: '280px',
          padding: '0',
          width: '100%',
        }}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#357F83',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>View post on Instagram @bit.eup</span>
          </a>
        </div>
      </blockquote>
    </div>
  );
};
