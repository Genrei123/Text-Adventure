import React, { useState } from 'react';
import Button, { ButtonState } from './Button';

const ButtonExample: React.FC = () => {
  const [mainButtonState, setMainButtonState] = useState<ButtonState>('idle');

  return (
    <div className="flex flex-col items-center space-y-8 p-8 bg-gray-800">
      <h2 className="text-2xl font-cinzel text-white mb-4">Button Component Examples</h2>
      
      {/* Main button variant with different states */}
      <div className="space-y-8">
        <h3 className="text-xl font-cinzel text-white">Main Button Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Default/Idle</p>
            <Button 
              variant="main" 
              onClick={() => console.log('Main button clicked')}
            >
              BUTTON
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Hover</p>
            <Button 
              variant="main" 
              state="hover"
              onClick={() => console.log('Main button hover clicked')}
            >
              BUTTON
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Pressed</p>
            <Button 
              variant="main" 
              state="pressed"
              onClick={() => console.log('Main button pressed clicked')}
            >
              BUTTON
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Active</p>
            <Button 
              variant="main" 
              state="active"
              onClick={() => console.log('Main button active clicked')}
            >
              BUTTON
            </Button>
          </div>
        </div>
        
        {/* Interactive Main Button */}
        <div className="flex flex-col items-center mt-8">
          <p className="text-white mb-2">Interactive Main Button (Current State: {mainButtonState})</p>
          <Button 
            variant="main"
            state={mainButtonState}
            onMouseEnter={() => setMainButtonState('hover')}
            onMouseDown={() => setMainButtonState('pressed')}
            onMouseUp={() => setMainButtonState('hover')}
            onMouseLeave={() => setMainButtonState('idle')}
            onClick={() => {
              setMainButtonState('active');
              setTimeout(() => setMainButtonState('idle'), 2000);
            }}
          >
            BUTTON
          </Button>
        </div>
      </div>
      
      {/* Other variants */}
      <div className="space-y-6 mt-8">
        <h3 className="text-xl font-cinzel text-white">Color Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Default</p>
            <Button 
              onClick={() => console.log('Default button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Primary</p>
            <Button 
              variant="primary" 
              onClick={() => console.log('Primary button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Secondary</p>
            <Button 
              variant="secondary" 
              onClick={() => console.log('Secondary button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Danger</p>
            <Button 
              variant="danger" 
              onClick={() => console.log('Danger button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Success</p>
            <Button 
              variant="success" 
              onClick={() => console.log('Success button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
        </div>
      </div>
      
      {/* Different sizes */}
      <div className="space-y-6 mt-8">
        <h3 className="text-xl font-cinzel text-white">Button Sizes</h3>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Extra Small (xs)</p>
            <Button 
              size="xs" 
              onClick={() => console.log('XS button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Small (sm)</p>
            <Button 
              size="sm" 
              onClick={() => console.log('Small button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Medium (md - Default)</p>
            <Button 
              onClick={() => console.log('Medium button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Large (lg)</p>
            <Button 
              size="lg" 
              onClick={() => console.log('Large button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Extra Large (xl)</p>
            <Button 
              size="xl" 
              onClick={() => console.log('XL button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white mb-2">Custom Size</p>
            <Button 
              size="custom"
              customSize={{
                width: 'w-[320px]',
                height: 'h-[80px]',
                fontSize: 'text-2xl',
                padding: 'px-4'
              }}
              onClick={() => console.log('Custom size button clicked')}
            >
              Embark on the Quest
            </Button>
          </div>
        </div>
      </div>
      
      {/* Full width */}
      <div className="w-full mt-8">
        <p className="text-white mb-2 text-center">Full Width</p>
        <Button 
          fullWidth 
          onClick={() => console.log('Full width button clicked')}
        >
          Embark on the Quest
        </Button>
      </div>
    </div>
  );
};

export default ButtonExample;
