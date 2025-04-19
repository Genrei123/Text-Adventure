import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plan {
  id: string;
  duration: string;
  credit: string;
  cost: string;
}

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerType: string;
  subcontext: string;
  features: string[];
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
}

const OfferSidebar: React.FC<{
  offerType: string;
  subcontext: string;
  features: string[];
}> = ({ offerType, subcontext, features }) => (
  <aside className="p-6 bg-[#311F17] text-white w-[35%] max-md:w-full">
    <h2 id="modal-title" className="text-xl font-cinzel font-bold mb-2 text-[#B28F4C]">
      {offerType}
    </h2>
    <p className="mb-6 text-sm text-gray-300">{subcontext}</p>
    
    <div>
      <h4 className="font-cinzel font-bold text-[#B28F4C] mb-2 text-lg">Features:</h4>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm flex items-start">
            <svg className="h-5 w-5 text-[#B28F4C] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  offerType,
  subcontext,
  features,
  plans,
  onPlanSelect,
}) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userHasSubscription, setUserHasSubscription] = useState(false);

  // Check if user already has a subscription when the component mounts
  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) return;

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/user/${email}`);
 
        if (response.data && response.data.length > 0) {
          // Filter only active subscriptions
          const activeSubscriptions = response.data.filter((sub: any) => sub.status === 'active');
          
          if (activeSubscriptions.length > 0) {
            setUserHasSubscription(true);
            // You can update this message based on the actual subscription found
            const currentPlan = activeSubscriptions[0].subscriptionType;
            setError(`You already have an active "${currentPlan}" subscription. No need to subscribe again.`);
          }
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };

    checkUserSubscription();
  }, []);

  const handleSubscribe = async () => {
    if (plans.length === 0) return;
    
    const selectedPlan = plans[selectedPlanIndex];
    setError(null);
    setSubscribing(true);

    // Check if user already has a subscription
    if (userHasSubscription) {
      setError(`You already have an active subscription. No need to subscribe again.`);
      setSubscribing(false);
      return;
    }

    try {
      // Get user's email from localStorage
      const email = localStorage.getItem('email');
      
      if (!email) {
        setError('Please log in to subscribe');
        setSubscribing(false);
        return;
      }

      console.log('Creating subscription for plan:', {
        plan: selectedPlan,
        email: email,
        offerId: selectedPlan.id
      });
      
      // Send the subscription request to the backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/subscribe`, {
        email,
        offerId: selectedPlan.id
      });
      
      console.log('Subscription API response:', response.data);
      
      // Check if we received a payment link
      if (response.data && response.data.paymentLink) {
        console.log('Redirecting to payment URL:', response.data.paymentLink);
        
        // Store the subscription info in localStorage before redirecting
        localStorage.setItem('pendingSubscription', JSON.stringify({
          plan: offerType,
          timestamp: new Date().toISOString(),
          subscriptionId: response.data.subscriptionId || '',
          externalId: response.data.externalId || ''
        }));
        
        // Redirect to the payment page
        window.location.href = response.data.paymentLink;
      } else {
        console.error('No payment link in response:', response.data);
        setError('Failed to generate payment link. Please try again.');
        setSubscribing(false);
      }
    } catch (err: any) {
      console.error('Error creating subscription:', err);
      
      // Check for specific error related to existing subscriptions
      if (err.response?.data?.error && err.response.data.error.includes('already has an active subscription')) {
        setUserHasSubscription(true);
        setError('You already have an active subscription. No need to subscribe again.');
      } else {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to create subscription. Please try again.';
        setError(errorMessage);
      }
      
      setSubscribing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex justify-center items-center p-5 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div
          className="flex overflow-hidden rounded-2xl h-[435px] w-[710px] max-md:flex-col max-md:h-auto max-md:w-[90%] max-sm:w-full bg-[#311F17]"
          onClick={(e) => e.stopPropagation()}
        >
          <OfferSidebar
            offerType={offerType}
            subcontext={subcontext}
            features={features}
          />

          <main className="flex-1 px-6 py-5 bg-[#563C2D] max-md:p-5">
            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedPlanIndex === index
                      ? "border-[#B28F4C] bg-[#4a3325]"
                      : "border-transparent hover:border-[#B28F4C] bg-[#3f2c20]"
                  }`}
                  onClick={() => setSelectedPlanIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">{plan.duration}</h3>
                      <p className="text-gray-300 text-sm">{plan.credit}</p>
                    </div>
                    <div className="text-[#B28F4C] text-xl font-bold">
                      {plan.cost}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center mt-4 mb-4 p-2 bg-red-900 bg-opacity-30 rounded">
                {error}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button 
                className={`${
                  subscribing || userHasSubscription
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-[#B28F4C] hover:bg-[#8e7340]"
                } text-white py-2 px-8 rounded transition-colors`}
                onClick={handleSubscribe}
                disabled={subscribing || userHasSubscription}
              >
                {subscribing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : userHasSubscription ? (
                  "Already Subscribed"
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};