import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import axios from 'axios';
import { OfferModal } from './OfferModal';

// Update interface to match the actual API response
interface SubscriptionPlan {
    offerId: string;
    offerName: string;
    description: string;
    price: string;
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

// Updated to match the actual API response format
interface UserSubscription {
    id: string;
    email: string;
    subscribedAt: string;
    startDate: string;
    endDate: string | null;
    subscriptionType: string;
    status: string;
    duration: number;
}

const Subscription: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [subscriptionOffers, setSubscriptionOffers] = useState<SubscriptionPlan[]>([]);
    const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [confirmUnsubscribe, setConfirmUnsubscribe] = useState(false);
    const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch subscription offers and user's current subscription
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Load subscription offers
                const offersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/offers`);
                console.log('Fetched subscription offers:', offersResponse.data);
                setSubscriptionOffers(offersResponse.data);

                // Get user's email from localStorage
                const email = localStorage.getItem('email');

                if (email) {
                    // Load user's current subscription using the correct endpoint
                    const subscriptionResponse = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/shop/subscription/user/${email}`
                    );
                    console.log('User subscription data:', subscriptionResponse.data);

                    // Check if there are any subscriptions in the array
                    if (subscriptionResponse.data && subscriptionResponse.data.length > 0) {
                        // Get the most recent subscription (assuming they're ordered by date)
                        setUserSubscription(subscriptionResponse.data[0]);
                    } else {
                        setUserSubscription(null);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Simulate initial loading screen
    useEffect(() => {
        // Simulate loading time
        setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setIsInitialLoading(false);
            }, 500);
        }, 2000);
    }, []);

    const handlePlanClick = (plan: PlanDisplay) => {
        if (plan.title === "Freedom Sword") return; // Don't show modal for free tier

        // If user is already subscribed to this plan, show confirmation to unsubscribe
        if (userSubscription && userSubscription.subscriptionType === plan.title) {
            setSelectedPlan(plan);
            setConfirmUnsubscribe(true);
            return;
        }

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
        setConfirmUnsubscribe(false);
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

    // Handle unsubscribe
    const handleUnsubscribe = async () => {
        const email = localStorage.getItem('email');

        if (!email || !userSubscription) {
            alert('No active subscription found');
            return;
        }

        setUnsubscribeLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/unsubscribe`, {
                email,
                subscriptionId: userSubscription.id // Using the correct id field from the API response
            });

            console.log('Unsubscribe response:', response.data);
            setMessage('Successfully unsubscribed. You can now subscribe to other plans.');
            setTimeout(() => setMessage(''), 5000);
            setUserSubscription(null); // Clear the subscription
            setConfirmUnsubscribe(false);
        } catch (error: any) {
            console.error('Error unsubscribing:', error);
            setMessage(`Failed to unsubscribe: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        } finally {
            setUnsubscribeLoading(false);
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
            id: "SUB001",
            title: "Adventurer's Entry",
            desc: "Gain extra tokens, extended prompt limits, and access to enhanced character options.",
            price: "₱100/mo",
            img: "/Adventurer.png",
            btnText: "EMBARK ON YOUR PATH",
            btnColor: "bg-black"
        },
        {
            id: "SUB002",
            title: "Hero's Journey",
            desc: "Enjoy unlimited prompts, customizable characters, ad-free storytelling, and access to exclusive worlds.",
            price: "₱250/mo",
            img: "/Hero.png",
            btnText: "BECOME A HERO",
            btnColor: "bg-black"
        },
        {
            id: "SUB003",
            title: "Legend's Legacy",
            desc: "Unlock ultimate features including early access to new worlds, personalized storylines, and priority support.",
            price: "₱500/mo",
            img: "/Legend.png",
            btnText: "FORGE YOUR LEGACY",
            btnColor: "bg-black"
        }
    ];

    // Update button text and color based on user's subscription
    const updatedDisplayPlans = displayPlans.map((plan) => {
        if (!userSubscription) {
            // If no subscription exists, "Freedom Sword" is the default
            if (plan.title === "Freedom Sword") {
                return {
                    ...plan,
                    btnText: "CURRENT PATH",
                    btnColor: "bg-green-600",
                    isDisabled: true, // Disable clicking
                };
            }
            return {
                ...plan,
                btnText: "EMBARK ON YOUR PATH",
                btnColor: "bg-black",
                isDisabled: false, // Allow clicking
            };
        }

        // If the user has an active subscription
        if (userSubscription.subscriptionType === plan.title) {
            return {
                ...plan,
                btnText: userSubscription.status === "active" ? "CURRENT PATH" :
                    userSubscription.status === "pending" ? "PENDING ACTIVATION" :
                        "MANAGE SUBSCRIPTION",
                btnColor: userSubscription.status === "active" ? "bg-green-600" :
                    userSubscription.status === "pending" ? "bg-yellow-600" :
                        "bg-blue-600",
                isDisabled: true, // Disable clicking for the current subscription
            };
        }

        // For other plans, show "Already Subscribed" if the user has a subscription
        return {
            ...plan,
            btnText: userSubscription.status === "active" ? "ALREADY SUBSCRIBED" : "EMBARK ON YOUR PATH",
            btnColor: userSubscription.status === "active" ? "bg-gray-400" : "bg-black",
            isDisabled: userSubscription.status === "active", // Disable clicking if already subscribed
        };
    });

    if (isInitialLoading) {
        return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />;
    }

    // Format date for display
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <Navbar />
            <div className="bg-cover min-h-screen p-4" style={{ backgroundImage: 'url(Billings.png)' }}>
                {/* <Sidebar /> */}
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-cinzel my-10">Find Your Path</h2>
                    <h4 className="text-lg md:text-xl font-cinzel mb-6">Unlock Your Full Potential</h4>

                    {userSubscription && userSubscription.subscriptionType !== "Freedom Sword" && (
                        <div className="mb-8 p-4 rounded-lg bg-[#563C2D] bg-opacity-70">
                            <h3 className="text-xl font-cinzel mb-2">Current Subscription</h3>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                                <div className="text-left">
                                    <p className="font-bold">{userSubscription.subscriptionType}</p>
                                    <p className="text-sm">Status: <span className={
                                        userSubscription.status === "active" ? "text-green-400" :
                                            userSubscription.status === "pending" ? "text-yellow-300" :
                                                "text-gray-300"
                                    }>{userSubscription.status.charAt(0).toUpperCase() + userSubscription.status.slice(1)}</span></p>
                                    <p className="text-sm">Start Date: {formatDate(userSubscription.startDate)}</p>
                                    {userSubscription.endDate && (
                                        <p className="text-sm">Expiry Date: {formatDate(userSubscription.endDate)}</p>
                                    )}
                                </div>
                                {userSubscription.status === "active" && (
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                                        onClick={() => {
                                            // Find the plan that matches the user's subscription
                                            const plan = displayPlans.find(p => p.title === userSubscription.subscriptionType);
                                            if (plan) {
                                                setSelectedPlan(plan);
                                                setConfirmUnsubscribe(true);
                                            }
                                        }}
                                    >
                                        Manage Subscription
                                    </button>
                                )}
                            </div>
                            <p className="mt-2 text-sm">Click on your current plan to manage your subscription</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-3 rounded-lg bg-green-500 text-white">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                            <p className="mt-4">Loading subscription plans...</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-8 mt-6">
                            {updatedDisplayPlans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`bg-white w-72 p-6 rounded-lg shadow-lg border-4 border-[#563C2D] transform transition-transform ${plan.isDisabled ? "" : "hover:scale-110"
                                        }`}
                                    onClick={() => {
                                        if (!plan.isDisabled) {
                                            handlePlanClick(plan);
                                        }
                                    }}
                                >
                                    <img src={plan.img} alt={plan.title} className="w-full" />
                                    <h1 className="text-[#B28F4C] text-center text-xl font-bold font-cinzel mt-4">{plan.title}</h1>
                                    <p className="text-black text-center p-2">{plan.desc}</p>
                                    <h2 className="text-black text-center text-2xl font-bold font-playfair">{plan.price}</h2>
                                    <button
                                        className={`w-full text-white p-2 rounded-md mt-4 ${plan.btnColor}`}
                                        disabled={plan.isDisabled} // Disable the button if the plan is not clickable
                                    >
                                        {plan.btnText}
                                    </button>
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

            {confirmUnsubscribe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-black mb-4">Manage Subscription</h3>
                        <p className="text-gray-700 mb-4">
                            You are currently subscribed to {selectedPlan?.title}.
                            {userSubscription?.endDate ?
                                ` Your subscription is active until ${formatDate(userSubscription.endDate)}.` :
                                ' Your subscription is currently active.'}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                                onClick={handleUnsubscribe}
                                disabled={unsubscribeLoading || userSubscription?.status !== 'active'}
                            >
                                {unsubscribeLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : "Cancel Subscription"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Subscription;