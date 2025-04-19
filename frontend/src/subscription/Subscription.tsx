import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import axios from 'axios';
import { OfferModal } from './OfferModal';
import './subscription-cards.css';

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
    duration?: number;
}

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
    const [subscriptionOffers, setSubscriptionOffers] = useState<PlanDisplay[]>([]);
    const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [confirmUnsubscribe, setConfirmUnsubscribe] = useState(false);
    const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const offersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/offers`);
            console.log('Fetched subscription offers:', offersResponse.data);

            // Map the fetched subscription offers to include the `img` property
            const mappedOffers = offersResponse.data.map((offer: SubscriptionPlan) => {
                let img = '';
                switch (offer.offerName) {
                    case "Freedom Sword":
                        img = "/Freemium.png";
                        break;
                    case "Adventurer's Entry":
                        img = "/Adventurer.png";
                        break;
                    case "Hero's Journey":
                        img = "/Hero.png";
                        break;
                    case "Legend's Legacy":
                        img = "/Legend.png";
                        break;
                    default:
                        img = "/default.png"; // Fallback image
                }

                return {
                    id: offer.offerId,
                    title: offer.offerName,
                    desc: offer.description,
                    price: offer.price,
                    img: img,
                    btnText: "EMBARK ON YOUR PATH", // Default button text
                    btnColor: "bg-black" // Default button color
                };
            });

            setSubscriptionOffers(mappedOffers);

            const email = localStorage.getItem('email');

            if (email) {
                const subscriptionResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/shop/subscription/user/${email}`
                );
                console.log('User subscription data:', subscriptionResponse.data);

                if (subscriptionResponse.data && subscriptionResponse.data.length > 0) {
                    const subscriptions = subscriptionResponse.data;
                    const activeSubscription = subscriptions.find((sub: UserSubscription) =>
                        sub.status === 'active' || sub.status === 'cancelled'
                    );
                    setUserSubscription(activeSubscription || null);
                } else {
                    setUserSubscription(null);
                }
            }

            setIsInitialLoading(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsInitialLoading(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Automatically check for expired subscriptions when the page loads
        checkExpiredSubscriptions();
    }, []);

    const checkExpiredSubscriptions = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/check-expired`);
        } catch (error: any) {
            console.error('Error checking expired subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanClick = (plan: PlanDisplay) => {
        if (plan.title === "Freedom Sword") return;

        if (userSubscription && userSubscription.subscriptionType === plan.title) {
            setSelectedPlan(plan);
            setConfirmUnsubscribe(true);
            return;
        }

        console.log('Clicked plan:', plan);

        const backendPlan = subscriptionOffers.find(offer => offer.title === plan.title);

        if (backendPlan) {
            console.log('Found matching backend plan:', backendPlan);
            setSelectedPlan({
                ...plan,
                offerId: backendPlan.id,
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
                subscriptionId: userSubscription.id
            });

            console.log('Unsubscribe response:', response.data);

            if (userSubscription) {
                setUserSubscription({
                    ...userSubscription,
                    status: 'cancelled'
                });
            }

            setMessage('Successfully cancelled subscription. You will have access until your subscription period ends.');
            setTimeout(() => setMessage(''), 5000);
            setConfirmUnsubscribe(false);
        } catch (error: any) {
            console.error('Error unsubscribing:', error);
            setMessage(`Failed to unsubscribe: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        } finally {
            setUnsubscribeLoading(false);
        }
    };

    const updatedDisplayPlans = subscriptionOffers.map((plan) => {
        const formattedPrice = plan.price === "0" || plan.price === "0" || parseFloat(plan.price) === 0 ? "FREE" : plan.price;

        if (!userSubscription || userSubscription.status === "inactive") {
            if (plan.title === "Freedom Sword") {
                return {
                    ...plan,
                    price: formattedPrice,
                    btnText: "CURRENT PATH",
                    btnColor: "tier-button-subscribed", // Use this class for current path
                    isDisabled: true,
                };
            }
            return {
                ...plan,
                price: formattedPrice,
                btnText: "EMBARK ON YOUR PATH",
                btnColor: "tier-button-unsubscribed", // Use this class for available paths
                isDisabled: false,
            };
        }

        // For subscribed plans, always use the subscribed class
        if (userSubscription.subscriptionType === plan.title) {
            return {
                ...plan,
                price: formattedPrice,
                btnText: userSubscription.status === "active" ? "CURRENT PATH" :
                    userSubscription.status === "pending" ? "PENDING ACTIVATION" :
                        userSubscription.status === "cancelled" ? "CANCELLED" :
                            "MANAGE SUBSCRIPTION",
                btnColor: "tier-button-subscribed", // Always use this class for any active subscription
                isDisabled: true,
            };
        }

        // For all other cases, use the unsubscribed class
        return {
            ...plan,
            price: formattedPrice,
            btnText: "EMBARK ON YOUR PATH",
            btnColor: "tier-button-unsubscribed", // Use this for all other available plans
            isDisabled: false,
        };
    });

    if (isInitialLoading) {
        return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />;
    }

    return (
        <>
            <Navbar />
            <div className="bg-cover min-h-screen p-4" style={{ backgroundImage: 'url(Billings.png)' }}>
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-cinzel my-10">Find Your Path</h2>
                    <h4 className="text-lg md:text-xl font-cinzel mb-6">Unlock Your Full Potential</h4>

                    {userSubscription && userSubscription.status !== "inactive" && userSubscription.subscriptionType !== "Freedom Sword" && (
                        <div className="mb-8 p-4 rounded-lg bg-[#563C2D] bg-opacity-70">
                            <h3 className="text-xl font-cinzel mb-2">Current Subscription</h3>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                                <div className="text-left">
                                    <p className="font-bold">{userSubscription.subscriptionType}</p>
                                    <p className="text-sm">Status: <span className={
                                        userSubscription.status === "active" ? "text-green-400" :
                                            userSubscription.status === "pending" ? "text-yellow-300" :
                                                userSubscription.status === "cancelled" ? "text-orange-300" :
                                                    "text-gray-300"
                                    }>
                                        {userSubscription.status === "cancelled" ? "Cancelled (Access until expiry)" :
                                            userSubscription.status}
                                    </span></p>
                                    <p className="text-sm">Start Date: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(userSubscription.startDate))}</p>
                                    {userSubscription.endDate && (
                                        <p className="text-sm">Expiry Date: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(userSubscription.endDate))}</p>
                                    )}
                                </div>
                                {userSubscription.status === "active" && (
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                                        onClick={() => {
                                            const plan = subscriptionOffers.find(p => p.title === userSubscription.subscriptionType);
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
                            <p className="mt-2 text-sm">
                                {userSubscription.status === "cancelled"
                                    ? "Your subscription is cancelled but you'll have access until the expiry date"
                                    : "Click on your current plan to manage your subscription"}
                            </p>
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
                            {updatedDisplayPlans.map((plan, index) => {
                                // Determine the tier class based on the plan title
                                let tierClass = '';
                                let titleClass = '';
                                let buttonClass = '';
                                let ribbonClass = '';
                                let ribbonText = '';
                                let animation = '';

                                switch (plan.title) {
                                    // From your existing code:
                                    case 'Freedom Sword':
                                        tierClass = 'tier-bronze';
                                        titleClass = 'tier-title-bronze';
                                        buttonClass = plan.isDisabled ? plan.btnColor : 'tier-button-bronze';
                                        ribbonClass = 'ribbon-bronze';
                                        break;
                                    case 'Adventurer\'s Entry':
                                        tierClass = 'tier-silver';
                                        titleClass = 'tier-title-silver';
                                        buttonClass = plan.isDisabled ? plan.btnColor : 'tier-button-silver';
                                        ribbonClass = 'ribbon-silver';
                                        break;
                                    case 'Hero\'s Journey':
                                        tierClass = 'tier-gold';
                                        titleClass = 'tier-title-gold';
                                        buttonClass = plan.isDisabled ? plan.btnColor : 'tier-button-gold';
                                        ribbonClass = 'ribbon-gold';
                                        break;
                                    case 'Legend\'s Legacy':
                                        tierClass = 'tier-platinum';
                                        titleClass = 'tier-title-platinum';
                                        buttonClass = plan.isDisabled ? plan.btnColor : 'tier-button-platinum';
                                        ribbonClass = 'ribbon-platinum';
                                        break;

                                    // Should be changed to:
                                    case 'Freedom Sword':
                                        tierClass = 'tier-bronze';
                                        titleClass = 'tier-title-bronze';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        ribbonClass = 'ribbon-bronze';
                                        break;
                                    case 'Adventurer\'s Entry':
                                        tierClass = 'tier-silver';
                                        titleClass = 'tier-title-silver';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        ribbonClass = 'ribbon-silver';
                                        break;
                                    case 'Hero\'s Journey':
                                        tierClass = 'tier-gold';
                                        titleClass = 'tier-title-gold';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        ribbonClass = 'ribbon-gold';
                                        break;
                                    case 'Legend\'s Legacy':
                                        tierClass = 'tier-platinum';
                                        titleClass = 'tier-title-platinum';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        ribbonClass = 'ribbon-platinum';
                                        break;
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`relative bg-white w-72 p-6 rounded-lg shadow-lg border-4 ${tierClass} ${animation} transform transition-all duration-300 ${plan.isDisabled ? "" : "hover:scale-110"}`}
                                        onClick={() => {
                                            if (!plan.isDisabled) {
                                                handlePlanClick(plan);
                                            }
                                        }}
                                    >
                                        {/* Ribbon for tier indication */}
                                        {ribbonText !== 'Bronze' && (
                                            <div className="ribbon-container">
                                                <span className={`ribbon-text ${ribbonClass}`}>{ribbonText}</span>
                                            </div>
                                        )}

                                        <img src={plan.img} alt={plan.title} className="w-full rounded-md" />
                                        <h1 className={`${titleClass} text-center text-xl font-bold font-cinzel mt-4`}>{plan.title}</h1>
                                        <p className="text-black text-center p-2">{plan.desc}</p>
                                        <h2 className="text-black text-center text-2xl font-bold font-playfair">
                                            {plan.price === "FREE" ? plan.price : `${plan.price} /month`}
                                        </h2>
                                        <button
                                            className={`w-full text-white p-2 rounded-md mt-4 ${buttonClass}`}
                                            disabled={plan.isDisabled}
                                        >
                                            {plan.btnText}
                                        </button>
                                    </div>
                                );
                            })}
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
                            id: selectedPlan.offerId || selectedPlan.id,
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
                            {userSubscription?.endDate ? (
                                <>
                                    {` Your subscription is active until ${userSubscription.endDate}.`}
                                </>
                            ) : (
                                ' Your subscription is currently active.'
                            )}
                        </p>
                        <p className="text-gray-700 mb-4">
                            If you cancel, you'll still have access until the end of your current billing period,
                            after which your subscription benefits will end.
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