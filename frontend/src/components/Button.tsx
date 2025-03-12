import React, { useState, useRef, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Define button variants and sizes as types
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'main';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
export type ButtonState = 'idle' | 'hover' | 'pressed' | 'active';

// Create extended interface to handle both button props and motion props
interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
  state?: ButtonState; // Allow manual state control for active state
  customSize?: {
    width?: string;
    height?: string;
    fontSize?: string;
    padding?: string;
  };
}

type ButtonProps = ButtonBaseProps & Omit<HTMLMotionProps<"button">, keyof ButtonBaseProps>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  fullWidth = false,
  state,
  customSize,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Determine current state based on props or internal state
  const currentState: ButtonState = state || (isPressed ? 'pressed' : isHovered ? 'hover' : 'idle');
  
  // Track mouse position for hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (buttonRef.current && isHovered) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  // Get color styles based on variant and state
  const getVariantStyles = () => {
    switch (variant) {
      case 'main':
        switch (currentState) {
          case 'hover':
            return 'bg-[#1E1E1E] text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5),inset_0_4px_4px_0_rgba(0,0,0,1)]';
          case 'pressed':
          case 'active':
            return 'bg-amber-500 text-white shadow-[0_4px_4px_0_rgba(0,0,0,1),inset_0_4px_4px_0_rgba(0,0,0,1)]';
          default: // idle
            return 'bg-[#1E1E1E] text-white shadow-[0_4px_4px_0_rgba(0,0,0,1),inset_0_4px_4px_0_rgba(0,0,0,1)]';
        }
      case 'primary':
        switch (currentState) {
          case 'hover':
            return 'bg-gradient-to-b from-purple-800 to-indigo-700 text-white shadow-[0_0_10px_rgba(79,70,229,0.5),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          case 'pressed':
          case 'active':
            return 'bg-indigo-900 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          default: // idle
            return 'bg-gradient-to-b from-purple-900 to-indigo-800 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.2)]';
        }
      case 'secondary':
        switch (currentState) {
          case 'hover':
            return 'bg-gradient-to-b from-blue-800 to-blue-700 text-white shadow-[0_0_10px_rgba(37,99,235,0.5),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          case 'pressed':
          case 'active':
            return 'bg-blue-900 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          default: // idle
            return 'bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.2)]';
        }
      case 'danger':
        switch (currentState) {
          case 'hover':
            return 'bg-gradient-to-b from-red-800 to-red-700 text-white shadow-[0_0_10px_rgba(220,38,38,0.5),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          case 'pressed':
          case 'active':
            return 'bg-red-900 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          default: // idle
            return 'bg-gradient-to-b from-red-900 to-red-800 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.2)]';
        }
      case 'success':
        switch (currentState) {
          case 'hover':
            return 'bg-gradient-to-b from-green-800 to-green-700 text-white shadow-[0_0_10px_rgba(22,163,74,0.5),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          case 'pressed':
          case 'active':
            return 'bg-green-900 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          default: // idle
            return 'bg-gradient-to-b from-green-900 to-green-800 text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.2)]';
        }
      default: // default variant
        switch (currentState) {
          case 'hover':
            return 'bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-[0_0_10px_rgba(75,85,99,0.5),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          case 'pressed':
          case 'active':
            return 'bg-[#1E1E1E] text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.3)]';
          default: // idle
            return 'bg-gradient-to-b from-gray-900 to-[#1E1E1E] text-white shadow-[0_4px_4px_0_rgba(0,0,0,0.3),inset_0_4px_4px_0_rgba(0,0,0,0.2)]';
        }
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    if (size === 'custom' && customSize) {
      return `
        ${customSize.width ? customSize.width : 'w-[250px]'}
        ${customSize.height ? customSize.height : 'h-[65px]'}
        ${customSize.fontSize ? customSize.fontSize : 'text-lg'}
        ${customSize.padding ? customSize.padding : 'px-6'}
      `;
    }

    switch (size) {
      case 'xs':
        return 'h-8 px-3 text-xs';
      case 'sm':
        return 'h-10 px-4 text-sm';
      case 'lg':
        return 'h-16 px-8 text-xl';
      case 'xl':
        return 'h-20 px-10 text-2xl';
      default: // medium
        return 'h-[65px] px-6 text-lg';
    }
  };

  // Get hover effect style
  const getHoverEffect = () => {
    if (variant === 'main' && currentState === 'hover') {
      return (
        <div className="absolute inset-0 rounded-md border-2 border-amber-500 pointer-events-none" />
      );
    }
    
    if (currentState !== 'pressed' && currentState !== 'active') {
      return (
        <div
          className="absolute pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full bg-white blur-md w-24 h-24"
          style={{
            left: mousePos.x - 48,
            top: mousePos.y - 48,
          }}
        />
      );
    }
    return null;
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-md
        font-cinzel
        ${fullWidth ? 'w-full' : 'w-[250px]'}
        ${getSizeStyles()}
        ${getVariantStyles()}
        transition-all duration-200
        group
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {getHoverEffect()}
      {children}
    </motion.button>
  );
};

export default Button;
