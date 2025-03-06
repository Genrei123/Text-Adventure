import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { OfferModal } from './OfferModal';
import axios from 'axios';

// Update interface to match the actual API response
interface SubscriptionPlan {
    offerId: string;  // Note: this is offerId, not id
    offerName: string;
    description: string;
    price: string;  // Coming back as string from the API
    duration: number;
    createdAt: string;
    updatedAt: string;
}

interface PlanDisplay {
    id: string;
    title: string;
    desc: string;
    price: string;
    img: string;
    btnText: string;
    btnColor: string;
}

const Subscription: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [subscriptionOffers, setSubscriptionOffers] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch subscription offers from backend
    useEffect(() => {
        const fetchSubscriptionOffers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/offers`);
                console.log('Fetched subscription offers:', response.data);
                setSubscriptionOffers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscription offers:', error);
                setLoading(false);
            }
        };

        fetchSubscriptionOffers();
    }, []);

    const handlePlanClick = (plan: PlanDisplay) => {
        if (plan.title === "Freedom Sword") return; // Don't show modal for free tier
        
        console.log('Clicked plan:', plan);
        
        // Find matching backend data - note the use of offerId and offerName
        const backendPlan = subscriptionOffers.find(offer => offer.offerName === plan.title);
        
        if (backendPlan) {
            console.log('Found matching backend plan:', backendPlan);
            // Merge frontend display data with backend data
            setSelectedPlan({
                ...plan,
                // Use backend offerId as id for the API call
                offerId: backendPlan.offerId,
                backendPrice: backendPlan.price,
                backendDuration: backendPlan.duration
            });
        } else {
            console.log('No matching backend plan found');
            setSelectedPlan(plan);
        }
        
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    // Handle subscription purchase
    const handleSubscription = async (selectedDuration: string) => {
        const email = localStorage.getItem('email');
        
        if (!email) {
            alert('Please log in to subscribe');
            return;
        }

        if (!selectedPlan) {
            console.error('No plan selected');
            return;
        }

        // Use offerId from the backend data
        const offerId = selectedPlan.offerId || selectedPlan.id;

        if (!offerId) {
            console.error('Selected plan has no ID:', selectedPlan);
            alert('Unable to process subscription: plan ID is missing.');
            return;
        }

        try {
            console.log('Creating subscription with:', {
                email,
                offerId: offerId,
                duration: selectedDuration.split(" ")[0]
            });
            
            // Use the full path to the subscription creation endpoint
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/subscribe`, {
                email,
                offerId: offerId
            });
            
            console.log('Subscription API response:', response.data);
            
            if (response.data && response.data.paymentLink) {
                console.log('Redirecting to payment link:', response.data.paymentLink);
                window.location.href = response.data.paymentLink;
            } else {
                console.error('No payment link received:', response.data);
                alert('Could not process subscription. Please try again.');
            }
        } catch (error: any) {
            console.error('Error creating subscription:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
            alert(`Failed to create subscription: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        }
    };

    // Keep your static plan data for the frontend display
    const displayPlans: PlanDisplay[] = [
        { 
            id: "FREE",
            title: "Freedom Sword", 
            desc: "Begin your journey with 2000 tokens worth of free prompts and basic world access.", 
            price: "FREE", 
            img: "/Freemium.png", 
            btnText: "CURRENT PATH", 
            btnColor: "bg-green-600" 
        },
        { 
            id: "SUB001", // This will be overridden by the backend offerId when clicked
            title: "Adventurer's Entry", 
            desc: "Gain extra tokens, extended prompt limits, and access to enhanced character options.", 
            price: "₱100/mo", 
            img: "/Adventurer.png", 
            btnText: "EMBARK ON YOUR PATH", 
            btnColor: "bg-black" 
        },
        { 
            id: "SUB002", // This will be overridden by the backend offerId when clicked
            title: "Hero's Journey", 
            desc: "Enjoy unlimited prompts, customizable characters, ad-free storytelling, and access to exclusive worlds.", 
            price: "₱250/mo", 
            img: "/Hero.png", 
            btnText: "BECOME A HERO", 
            btnColor: "bg-black" 
        },
        { 
            id: "SUB003", // This will be overridden by the backend offerId when clicked
            title: "Legend's Legacy", 
            desc: "Unlock ultimate features including early access to new worlds, personalized storylines, and priority support.", 
            price: "₱500/mo", 
            img: "/Legend.png", 
            btnText: "FORGE YOUR LEGACY", 
            btnColor: "bg-black" 
        }
    ];

    return (
        <>
            <Navbar />
            <div className="bg-cover min-h-screen p-4" style={{ backgroundImage: 'url(Billings.png)' }}>
                <Sidebar />
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-cinzel my-10">Find Your Path</h2>
                    <h4 className="text-lg md:text-xl font-cinzel mb-6">Unlock Your Full Potential</h4>

                    {loading ? (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                            <p className="mt-4">Loading subscription plans...</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-8 mt-6">
                            {displayPlans.map((plan, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white w-72 p-6 rounded-lg shadow-lg border-4 border-[#563C2D] transform transition-transform hover:scale-110" 
                                    onClick={() => handlePlanClick(plan)}
                                >
                                    <img src={plan.img} alt={plan.title} className="w-full" />
                                    <h1 className="text-[#B28F4C] text-center text-xl font-bold font-cinzel mt-4">{plan.title}</h1>
                                    <p className="text-black text-center p-2">{plan.desc}</p>
                                    <h2 className="text-black text-center text-2xl font-bold font-playfair">{plan.price}</h2>
                                    <button className={`w-full text-white p-2 rounded-md mt-4 ${plan.btnColor}`}>{plan.btnText}</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && selectedPlan && (
                <OfferModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    offerType={selectedPlan.title}
                    subcontext={selectedPlan.desc}
                    features={[
                        "Premium world access",
                        "Extended character customization", 
                        "Ad-free experience",
                        selectedPlan.title === "Legend's Legacy" ? "Priority support" : "Standard support"
                    ]}
                    plans={[
                        { 
                            id: selectedPlan.offerId || selectedPlan.id, // Use offerId from backend if available
                            duration: "1 Month", 
                            credit: "Premium Access", 
                            cost: selectedPlan.price 
                        }
                    ]}
                    onPlanSelect={(plan: { duration: string }) => handleSubscription(plan.duration)}
                />
            )}
        </>
    );
};

export default Subscription;