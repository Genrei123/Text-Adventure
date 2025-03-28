import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface VolumeControlProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  initialVolume?: number;
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

const VolumeControl: React.FC<VolumeControlProps> = ({ 
  audioRef, 
  initialVolume = 0.5,
  position = { bottom: '20px', right: '20px' }
}) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(initialVolume);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      previousVolume.current = newVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) {
        setVolume(previousVolume.current);
      }
    } else {
      setIsMuted(true);
      previousVolume.current = volume > 0 ? volume : previousVolume.current;
    }
  };

  return (
    <StyledWrapper position={position}>
      <div className="volume-control-container">
        <label className="slider">
          <input 
            type="range" 
            className="level" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          />
          <svg 
            className="volume" 
            xmlns="http://www.w3.org/2000/svg" 
            version="1.1" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            width={512} 
            height={512} 
            x={0} 
            y={0} 
            viewBox="0 0 24 24" 
            style={{ backgroundColor: 'transparent' }} 
            xmlSpace="preserve"
            onClick={toggleMute}
          >
            {isMuted ? (
              // Muted icon
              <g>
                <path d="M22.707 2.293a1 1 0 0 0-1.414 0L17.586 6H13a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4.586l3.707 3.707a1 1 0 0 0 1.414-1.414zM12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z" fill="currentColor" data-original="#000000" />
                <path d="M16 9.414l2-2L19.414 9l-2 2 2 2L18 14.414l-2-2-2 2L12.586 13l2-2-2-2L14 7.586z" fill="currentColor" data-original="#000000" />
              </g>
            ) : volume < 0.5 ? (
              // Low volume icon
              <g>
                <path d="M15.53 16.53a.999.999 0 0 1-.703-1.711C15.572 14.082 16 13.054 16 12s-.428-2.082-1.173-2.819a1 1 0 1 1 1.406-1.422A6 6 0 0 1 18 12a6 6 0 0 1-1.767 4.241.996.996 0 0 1-.703.289zM12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z" fill="currentColor" data-original="#000000" />
              </g>
            ) : (
              // Full volume icon
              <g>
                <path d="M18.36 19.36a1 1 0 0 1-.705-1.71C19.167 16.148 20 14.142 20 12s-.833-4.148-2.345-5.65a1 1 0 1 1 1.41-1.419C20.958 6.812 22 9.322 22 12s-1.042 5.188-2.935 7.069a.997.997 0 0 1-.705.291z" fill="currentColor" data-original="#000000" />
                <path d="M15.53 16.53a.999.999 0 0 1-.703-1.711C15.572 14.082 16 13.054 16 12s-.428-2.082-1.173-2.819a1 1 0 1 1 1.406-1.422A6 6 0 0 1 18 12a6 6 0 0 1-1.767 4.241.996.996 0 0 1-.703.289zM12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z" fill="currentColor" data-original="#000000" />
              </g>
            )}
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ position: { top?: string; right?: string; bottom?: string; left?: string } }>`
  position: fixed;
  top: ${props => props.position.top || 'auto'};
  right: ${props => props.position.right || 'auto'};
  bottom: ${props => props.position.bottom || 'auto'};
  left: ${props => props.position.left || 'auto'};
  z-index: 9999;
  
  .volume-control-container {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 30px;
    padding: 8px 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  /* level settings */
  .slider {
    /* slider */
    --slider-width: 0px;
    --slider-height: 6px;
    --slider-bg: rgb(82, 82, 82);
    --slider-border-radius: 999px;
    /* level */
    --level-color: #F1DC68;
    --level-transition-duration: .2s;
    /* icon */
    --icon-margin: 0px;
    --icon-color: #F1DC68;
    --icon-size: 25px;
    
    &:hover {
      --slider-width: 100px;
    }
  }

  .slider {
    cursor: pointer;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .slider .volume {
    display: inline-block;
    vertical-align: top;
    margin-right: var(--icon-margin);
    color: var(--icon-color);
    width: var(--icon-size);
    height: auto;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }

  .slider .level {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: var(--slider-width);
    height: var(--slider-height);
    background: var(--slider-bg);
    overflow: hidden;
    border-radius: var(--slider-border-radius);
    -webkit-transition: width var(--level-transition-duration), height var(--level-transition-duration);
    -o-transition: width var(--level-transition-duration), height var(--level-transition-duration);
    transition: width var(--level-transition-duration), height var(--level-transition-duration);
    cursor: inherit;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
      height: calc(var(--slider-height) * 1.5);
    }
  }

  .slider .level::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0;
    height: 0;
    -webkit-box-shadow: -200px 0 0 200px var(--level-color);
    box-shadow: -200px 0 0 200px var(--level-color);
  }
`;

export default VolumeControl;
