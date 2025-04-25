import React, { useState, useRef, useEffect } from 'react';

interface DelayedTooltipProps {
  text: string;
  delay: number; // delay in milliseconds
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: string;
}

const DelayedTooltip: React.FC<DelayedTooltipProps> = ({
  text,
  delay = 500,
  children,
  position = 'top',
  width = '200px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate tooltip position styles based on the position prop
  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '5px' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '5px' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '5px' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '5px' };
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '5px' };
    }
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '14px',
    zIndex: 1000,
    width,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    pointerEvents: 'none',
    ...getPositionStyles()
  };

  const handleMouseEnter = () => {
    // Clear any existing timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    
    // Set a new timer
    timerRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    // Clear the timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Hide the tooltip
    setIsVisible(false);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div ref={tooltipRef} style={tooltipStyles}>
        {text}
      </div>
    </div>
  );
};

export default DelayedTooltip;