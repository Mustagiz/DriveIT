import React, { useState, useEffect, useRef } from 'react';
import './DecryptedText.css';

export default function DecryptedText({
  text = '',
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover', // 'hover' or 'view'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextChar = (char) => {
      if (char === ' ') return ' ';
      if (useOriginalCharsOnly) {
        const chars = Array.from(new Set(text.split('').filter(c => c !== ' ')));
        return chars[Math.floor(Math.random() * chars.length)];
      }
      return characters[Math.floor(Math.random() * characters.length)];
    };

    if (isHovering || (animateOn === 'view' && isScrambling)) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setDisplayText(() => {
          if (sequential) {
            if (revealedIndices.size < text.length) {
              const nextIndex = getNextIndex(revealedIndices, text.length, revealDirection);
              const newRevealed = new Set(revealedIndices);
              newRevealed.add(nextIndex);
              setRevealedIndices(newRevealed);
              return text
                .split('')
                .map((char, i) => {
                  if (char === ' ') return ' ';
                  if (newRevealed.has(i)) return text[i];
                  return getNextChar(char);
                })
                .join('');
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return text;
            }
          } else {
            if (currentIteration < maxIterations) {
              currentIteration++;
              return text
                .split('')
                .map((char) => getNextChar(char))
                .join('');
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return text;
            }
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => clearInterval(interval);
  }, [isHovering, isScrambling, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly, animateOn]);

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsScrambling(true);
            }
          });
        },
        { threshold: 0.2 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [animateOn]);

  const getNextIndex = (revealedSet, length, direction) => {
    const unrevealed = [];
    for (let i = 0; i < length; i++) {
      if (!revealedSet.has(i)) unrevealed.push(i);
    }
    if (unrevealed.length === 0) return 0;
    if (direction === 'start') return unrevealed[0];
    if (direction === 'end') return unrevealed[unrevealed.length - 1];
    return unrevealed[Math.floor(Math.random() * unrevealed.length)];
  };

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovering(true);
      setRevealedIndices(new Set());
    }
  };

  const handleMouseLeave = () => {
    if (animateOn === 'hover') {
      setIsHovering(false);
    }
  };

  return (
    <span
      ref={containerRef}
      className={`decrypted-text-wrapper ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className={className}>
        {displayText.split('').map((char, index) => {
          const isRevealed = revealedIndices.has(index) || (!isHovering && !isScrambling);
          return (
            <span
              key={index}
              className={isRevealed ? '' : (encryptedClassName || 'encrypted-char')}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
