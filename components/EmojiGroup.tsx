
import React from 'react';

interface EmojiGroupProps {
  emoji: string;
  count: number;
  className?: string;
}

const EmojiGroup: React.FC<EmojiGroupProps> = ({ emoji, count, className = "" }) => {
  const bubbleStyles = [
    'bg-rose-100/30 border-rose-100/80',
    'bg-amber-100/35 border-amber-100/80',
    'bg-orange-100/35 border-orange-100/80',
    'bg-yellow-100/35 border-yellow-100/80',
    'bg-stone-100/30 border-stone-100/80',
  ];

  return (
    <div className={`flex flex-wrap gap-4 p-6 border border-white/40 rounded-2xl bg-white/20 backdrop-blur-sm ${className}`}>
      {Array.from({ length: Math.max(0, count) }).map((_, i) => (
        <div 
          key={i} 
          className={`w-12 h-12 md:w-16 md:h-16 border-2 rounded-2xl flex items-center justify-center text-2xl md:text-3xl relative transition-transform hover:scale-105 ${bubbleStyles[i % bubbleStyles.length]} ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
          aria-label="object-counter"
        >
          {emoji}
          <div className="absolute -top-1 -right-1 text-[9px] bg-white/80 text-slate-700 rounded-full w-4 h-4 flex items-center justify-center">
            {i + 1}
          </div>
        </div>
      ))}
      {count === 0 && <div className="text-white/80 uppercase tracking-widest text-[10px] py-4">Add some emojis!</div>}
    </div>
  );
};

export default EmojiGroup;
