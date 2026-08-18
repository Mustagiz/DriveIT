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
  const safeText = String(text || '');
  const [displayText, setDisplayText] = useState(safeText);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    setDisplayText(String(text || ''));
  }, [text]);

  useEffect(() => {
    let interval;
    let currentIteration = 0;
    const currentText = String(text || '');

    const getNextChar = (char) => {
      if (char === ' ') return ' ';
      if (useOriginalCharsOnly) {
        const chars = Array.from(new Set(currentText.split('').filter(c => c !== ' ')));
        return chars.length > 0 ? chars[Math.floor(Math.random() * chars.length)] : char;
      }
      return characters[Math.floor(Math.random() * characters.length)];
    };

    if (isHovering || (animateOn === 'view' && isScrambling)) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setDisplayText(() => {
          if (sequential) {
            if (revealedIndices.size < currentText.length) {
              const nextIndex = getNextIndex(revealedIndices, currentText.length, revealDirection);
              const newRevealed = new Set(revealedIndices);
              newRevealed.add(nextIndex);
              setRevealedIndices(newRevealed);
              return currentText
                .split('')
                .map((char, i) => {
                  if (char === ' ') return ' ';
                  if (newRevealed.has(i)) return currentText[i];
                  return getNextChar(char);
                })
                .join('');
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return currentText;
            }
          } else {
            if (currentIteration < maxIterations) {
              currentIteration++;
              return currentText
                .split('')
                .map((char) => getNextChar(char))
                .join('');
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return currentText;
            }
          }
        });
      }, speed);
    } else {
      setDisplayText(currentText);
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
