import React, { useMemo } from 'react';

interface StarSpec {
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: string;
}

const FloatingStars: React.FC = () => {
  const stars = useMemo<StarSpec[]>(
    () =>
      Array.from({ length: 24 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3.5}s`,
        duration: `${3.2 + Math.random() * 2.8}s`,
        size: `${0.75 + Math.random() * 1.3}rem`,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star, index) => (
        <span
          key={index}
          className="star-pop absolute text-amber-100/85 drop-shadow-[0_0_8px_rgba(255,241,181,0.7)]"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
            fontSize: star.size,
          }}
        >
          ✨
        </span>
      ))}
    </div>
  );
};

export default FloatingStars;
