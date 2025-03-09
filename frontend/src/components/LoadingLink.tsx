import React from 'react';
import { useLoading } from '../context/LoadingContext';

interface LoadingLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const LoadingLink: React.FC<LoadingLinkProps> = ({ to, children, className }) => {
  const { navigateWithLoading } = useLoading();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default LoadingLink; 