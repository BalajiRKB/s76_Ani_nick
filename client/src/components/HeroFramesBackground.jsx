import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const FRAME_COUNT = 290;

const framePath = (index) => `/frames/frame-${String(index + 1).padStart(4, '0')}.webp`;

const HeroFramesBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameStateRef = useRef({ frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return undefined;
    }

    const images = Array.from({ length: FRAME_COUNT }, () => new Image());
    const loadedFrames = new Set();
    let isMounted = true;
    let hasStarted = false;

    const drawFrame = (index) => {
      const frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      const image = images[frameIndex];

      if (!image || !image.complete || image.naturalWidth === 0) {
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      }

      context.clearRect(0, 0, width, height);

      const imageAspect = image.naturalWidth / image.naturalHeight;
      const canvasAspect = width / height;
      let renderWidth = width;
      let renderHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > canvasAspect) {
        renderHeight = height;
        renderWidth = height * imageAspect;
        offsetX = (width - renderWidth) / 2;
      } else {
        renderWidth = width;
        renderHeight = width / imageAspect;
        offsetY = (height - renderHeight) / 2;
      }

      context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
    };

    const startAnimation = () => {
      if (hasStarted || !isMounted) {
        return;
      }

      hasStarted = true;
      drawFrame(0);

      animationRef.current = gsap.to(frameStateRef.current, {
        frame: FRAME_COUNT - 1,
        duration: 18,
        ease: 'none',
        repeat: -1,
        yoyo: true,
        onUpdate: () => {
          drawFrame(Math.round(frameStateRef.current.frame));
        },
      });
    };

    const handleResize = () => {
      drawFrame(Math.round(frameStateRef.current.frame));
    };

    images.forEach((image, index) => {
      image.onload = () => {
        loadedFrames.add(index);

        if (!hasStarted && index === 0) {
          startAnimation();
        }

        if (hasStarted && loadedFrames.has(Math.round(frameStateRef.current.frame))) {
          drawFrame(Math.round(frameStateRef.current.frame));
        }
      };

      image.onerror = () => {
        loadedFrames.add(index);
      };

      image.src = framePath(index);
    });

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      animationRef.current?.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,123,0,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(180deg,rgba(8,9,26,0.15),rgba(23,23,66,0.78)_68%,#171742)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
    </div>
  );
};

export default HeroFramesBackground;