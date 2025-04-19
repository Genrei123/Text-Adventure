import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import axios from 'axios';
import { OfferModal } from './OfferModal';
import SubscriptionBG2 from '../../public/SubscriptionBG2.png'; // Adjust the path based on your project structure
import './subscription-cards.css';
import { useSpring, animated } from 'react-spring';
import { motion } from 'framer-motion';

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
    const [backgroundPosition, setBackgroundPosition] = useState(0);
    const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(true);

    const fetchData = async () => {
        try {
            const offersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/offers`);
            console.log('Fetched subscription offers:', offersResponse.data);

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
                        img = "/default.png";
                }

                return {
                    id: offer.offerId,
                    title: offer.offerName,
                    desc: offer.description,
                    price: offer.price,
                    img: img,
                    btnText: "EMBARK ON YOUR PATH",
                    btnColor: "bg-black"
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
                    // Find active subscriptions but don't consider pending as active
                    const activeSubscription = subscriptions.find((sub: UserSubscription) =>
                        sub.status === 'active' || sub.status === 'cancelled'
                    );

                    // If no active or cancelled subscription found, try to find the last one that isn't pending
                    const lastNonPendingSubscription = subscriptions.find((sub: UserSubscription) =>
                        sub.status !== 'pending'
                    );

                    // Set the active subscription to be displayed, prioritizing active and cancelled
                    setUserSubscription(activeSubscription || lastNonPendingSubscription || subscriptions[0]);

                    // Check if subscription is expired and how long since expiry
                    const latestSubscription = activeSubscription || subscriptions[0];
                    if (latestSubscription && latestSubscription.endDate) {
                        const expiryDate = new Date(latestSubscription.endDate);
                        const currentDate = new Date();
                        const timeDiff = currentDate.getTime() - expiryDate.getTime();
                        const daysSinceExpiry = timeDiff / (1000 * 3600 * 24);

                        if (daysSinceExpiry > 7) {
                            setShowSubscriptionDetails(false);
                        } else {
                            setShowSubscriptionDetails(true);
                        }
                    }
                } else {
                    setUserSubscription(null);
                    setShowSubscriptionDetails(false);
                }
            }

            setIsInitialLoading(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsInitialLoading(false);
            setLoading(false);
            setShowSubscriptionDetails(false);
        }
    };

    useEffect(() => {
        fetchData();
        checkExpiredSubscriptions();

        // Add scroll event listener for parallax effect
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setBackgroundPosition(scrollPosition * 0.5); // Adjust the 0.5 factor to control the parallax speed
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const checkExpiredSubscriptions = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/check-expired`);
            console.log('Expired subscriptions check response:', response.data);
        } catch (error) {
            console.error('Error checking expired subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanClick = (plan: PlanDisplay) => {
        if (plan.title === "Freedom Sword") return;

        // Check if the user is currently subscribed to this plan and it's active or cancelled
        // Don't consider "pending" as a reason to show unsubscribe modal
        if (userSubscription &&
            userSubscription.subscriptionType === plan.title &&
            (userSubscription.status === "active" || userSubscription.status === "cancelled")) {
            setSelectedPlan(plan);
            setConfirmUnsubscribe(true);
            return;
        }

        // Allow subscribing to plans with pending status (abandoned checkout)
        if (userSubscription &&
            userSubscription.subscriptionType === plan.title &&
            userSubscription.status === "pending") {
            console.log('Retrying subscription for pending plan:', plan);
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

            // Add flag to clean up any pending subscriptions
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shop/subscribe`, {
                email,
                offerId: offerId,
                cleanupPending: true  // Add this flag for backend to handle cleanup
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

    const cleanupPendingSubscriptions = async () => {
        const email = localStorage.getItem('email');
        if (!email) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/shop/subscription/pending/${email}`);
            console.log('Cleaned up pending subscriptions');
        } catch (error) {
            console.error('Error cleaning up pending subscriptions:', error);
        }
    };

    // Update the useEffect hook to call this function
    useEffect(() => {
        cleanupPendingSubscriptions(); // Add this line
        fetchData();
        checkExpiredSubscriptions();

        // Add scroll event listener for parallax effect
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setBackgroundPosition(scrollPosition * 0.5); // Adjust the 0.5 factor to control the parallax speed
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const updatedDisplayPlans = subscriptionOffers.map((plan) => {
        const formattedPrice = plan.price === "0" || plan.price === "0" || parseFloat(plan.price) === 0 ? "FREE" : plan.price;

        // Consider pending as a failed subscription, so user can resubscribe
        if (!userSubscription ||
            userSubscription.status === "inactive" ||
            userSubscription.status === "pending") {
            if (plan.title === "Freedom Sword") {
                return {
                    ...plan,
                    price: formattedPrice,
                    btnText: "CURRENT PATH",
                    btnColor: "tier-button-subscribed",
                    isDisabled: true,
                };
            }
            return {
                ...plan,
                price: formattedPrice,
                btnText: "EMBARK ON YOUR PATH",
                btnColor: "tier-button-unsubscribed",
                isDisabled: false,
            };
        }

        if (userSubscription.subscriptionType === plan.title) {
            return {
                ...plan,
                price: formattedPrice,
                btnText: userSubscription.status === "active" ? "CURRENT PATH" :
                    userSubscription.status === "cancelled" ? "CANCELLED" : "MANAGE SUBSCRIPTION",
                btnColor: "tier-button-subscribed",
                isDisabled: true,
            };
        }

        return {
            ...plan,
            price: formattedPrice,
            btnText: "EMBARK ON YOUR PATH",
            btnColor: "tier-button-unsubscribed",
            isDisabled: false,
        };
    });

    const subscriptionCardAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 120, friction: 14 }
    });

    // Determine badge text and color based on subscription status and endDate
    let badgeText = "";
    let badgeColor = "";
    let isExpired = false;

    if (userSubscription) {
        // First, check if the subscription has expired based on endDate
        if (userSubscription.endDate) {
            const expiryDate = new Date(userSubscription.endDate);
            const currentDate = new Date();
            if (currentDate > expiryDate) {
                isExpired = true;
                badgeText = "EXPIRED";
                badgeColor = "bg-gray-500 border-gray-400";
            }
        }

        // If not expired, set badge based on status
        if (!isExpired) {
            if (userSubscription.status === "active") {
                badgeText = "ACTIVE";
                badgeColor = "bg-yellow-600 border-yellow-400";
            } else if (userSubscription.status === "cancelled") {
                badgeText = "CANCELLED";
                badgeColor = "bg-red-600 border-red-400";
            } else if (userSubscription.status === "inactive" && userSubscription.endDate) {
                // For inactive subscriptions with an endDate, ensure EXPIRED is shown if past endDate
                const expiryDate = new Date(userSubscription.endDate);
                const currentDate = new Date();
                if (currentDate > expiryDate) {
                    isExpired = true;
                    badgeText = "EXPIRED";
                    badgeColor = "bg-gray-500 border-gray-400";
                }
            }
        }
    }

    if (isInitialLoading) {
        return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />;
    }

    return (
        <>
            <Navbar />
            <div
                className="bg-cover min-h-screen p-4 background-overlay"
                style={{
                    backgroundImage: `url(${SubscriptionBG2})`,
                    backgroundPosition: `center ${backgroundPosition}px`,
                    backgroundSize: 'cover'
                }}
            >
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-cinzel my-10">Find Your Path</h2>
                    <h4 className="text-lg md:text-xl font-cinzel mb-6">Unlock Your Full Potential</h4>

                    {userSubscription && showSubscriptionDetails && (
                        <div className="relative">
                            <animated.div
                                style={subscriptionCardAnimation}
                                className="mb-8 p-4 rounded-lg bg-[#563C2D] bg-opacity-70 subscription-status-gold relative overflow-hidden"
                            >
                                {/* Animated Border */}
                                <motion.div
                                    className="absolute inset-0 border-4 rounded-lg pointer-events-none"
                                    style={{ borderColor: '#FFDF00' }}
                                    animate={{
                                        boxShadow: ['0 0 10px 2px rgba(255, 223, 0, 0.3)', '0 0 25px 5px rgba(255, 223, 0, 0.6)', '0 0 10px 2px rgba(255, 223, 0, 0.3)']
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                />

                                {/* Shine effect */}
                                <div className="gold-gleam"></div>

                                {/* Corner accents */}
                                <motion.div
                                    className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-yellow-400"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-yellow-400"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                                <motion.div
                                    className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-yellow-400"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                                <motion.div
                                    className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-yellow-400"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    <motion.h3
                                        className="text-xl font-cinzel mb-2"
                                        animate={{ textShadow: ['0 0 5px gold', '0 0 15px gold', '0 0 5px gold'] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        Current Subscription
                                    </motion.h3>

                                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                                        <div className="text-left">
                                            <motion.p
                                                className="font-bold"
                                                animate={{ color: ['#FFFFFF', '#FFD700', '#FFFFFF'] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            >
                                                {userSubscription.subscriptionType}
                                            </motion.p>
                                            <p className="text-sm">Status: <span className={
                                                userSubscription.status === "active" ? "text-green-400" :
                                                    userSubscription.status === "pending" ? "text-yellow-300" :
                                                        userSubscription.status === "cancelled" ? "text-orange-300" :
                                                            isExpired ? "text-gray-300" : "text-gray-300"
                                            }>
                                                {isExpired ? "Expired" :
                                                    userSubscription.status === "cancelled" ? "Cancelled (Access until expiry)" :
                                                        userSubscription.status === "active" ? "Active" :
                                                            userSubscription.status}
                                            </span></p>
                                            <p className="text-sm">Start Date: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(userSubscription.startDate))}</p>
                                            {userSubscription.endDate && (
                                                <p className="text-sm">Expiry Date: {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(userSubscription.endDate))}</p>
                                            )}
                                        </div>

                                        {userSubscription.status === "active" && (
                                            <motion.button
                                                className="relative px-4 py-2 bg-red-600 text-white rounded-md overflow-hidden"
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)"
                                                }}
                                                onClick={() => {
                                                    const plan = subscriptionOffers.find(p => p.title === userSubscription.subscriptionType);
                                                    if (plan) {
                                                        setSelectedPlan(plan);
                                                        setConfirmUnsubscribe(true);
                                                    }
                                                }}
                                            >
                                                <motion.span
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                                                    initial={{ left: "-100%" }}
                                                    animate={{ left: "100%" }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1.5,
                                                        repeatDelay: 1
                                                    }}
                                                />
                                                <span className="relative z-10">Manage Subscription</span>
                                            </motion.button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm">
                                        {userSubscription.status === "cancelled"
                                            ? "Your subscription is cancelled but you'll have access until the expiry date"
                                            : "Click on your current plan to manage your subscription"}
                                    </p>
                                </div>
                            </animated.div>

                            {/* Badge moved outside the container */}
                            {badgeText && (
                                <motion.div
                                    className={`absolute top-0 right-0 ${badgeColor} text-xs font-bold px-2 py-1 rounded-full border-2 text-white transform translate-x-1/2 -translate-y-1/2`}
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: 1,
                                        rotate: [0, 5, 0, -5, 0],
                                        boxShadow: [
                                            '0 0 5px rgba(255, 215, 0, 0.5)',
                                            '0 0 15px rgba(255, 215, 0, 0.7)',
                                            '0 0 5px rgba(255, 215, 0, 0.5)'
                                        ]
                                    }}
                                    transition={{
                                        scale: { duration: 0.5 },
                                        rotate: {
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        },
                                        boxShadow: {
                                            repeat: Infinity,
                                            duration: 2
                                        }
                                    }}
                                >
                                    {badgeText}
                                </motion.div>
                            )}
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
                                let tierClass = '';
                                let imageClass = '';
                                let titleClass = '';
                                let buttonClass = '';

                                switch (plan.title) {
                                    case 'Freedom Sword':
                                        tierClass = 'tier-card-bronze';
                                        imageClass = 'tier-image-bronze';
                                        titleClass = 'tier-title-bronze';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        break;
                                    case 'Adventurer\'s Entry':
                                        tierClass = 'tier-card-silver';
                                        imageClass = 'tier-image-silver';
                                        titleClass = 'tier-title-silver';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        break;
                                    case 'Hero\'s Journey':
                                        tierClass = 'tier-card-gold';
                                        imageClass = 'tier-image-gold';
                                        titleClass = 'tier-title-gold';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        break;
                                    case 'Legend\'s Legacy':
                                        tierClass = 'tier-card-platinum';
                                        imageClass = 'tier-image-platinum';
                                        titleClass = 'tier-title-platinum';
                                        buttonClass = plan.isDisabled ?
                                            (userSubscription?.subscriptionType === plan.title ? 'tier-button-subscribed' : plan.btnColor) :
                                            'tier-button-unsubscribed';
                                        break;
                                }

                                return (
                                    <motion.div
                                        key={index}
                                        className={`relative w-72 shadow-lg tier-card ${tierClass} flex flex-col`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={!plan.isDisabled ? {
                                            scale: 1.05
                                        } : {}}
                                        onClick={() => {
                                            if (!plan.isDisabled) {
                                                handlePlanClick(plan);
                                            }
                                        }}
                                    >
                                        {/* Shine effect for card */}
                                        {!plan.isDisabled && (
                                            <motion.div
                                                className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                <motion.div
                                                    className="absolute w-20 h-[200%] bg-white opacity-20 transform -rotate-45"
                                                    animate={{
                                                        left: ['-20%', '120%'],
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1.5,
                                                        repeatDelay: 3
                                                    }}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Image Container */}
                                        <div className={`relative ${imageClass} overflow-hidden`}>
                                            <img src={plan.img} alt={plan.title} className="w-full" />
                                        </div>

                                        {/* Text Container */}
                                        <div className="tier-text-container p-6">
                                            <h1 className={`${titleClass} text-center text-xl font-bold font-cinzel mt-4`}>{plan.title}</h1>
                                            <p className="text-black text-center p-2">{plan.desc}</p>
                                            <h2 className="text-black text-center text-2xl font-bold font-playfair">
                                                {plan.price === "FREE" ? plan.price : `${plan.price} /month`}
                                            </h2>
                                            <motion.button
                                                className={`w-full text-white p-2 rounded-md mt-4 ${buttonClass}`}
                                                disabled={plan.isDisabled}
                                                whileHover={!plan.isDisabled ? { scale: 1.05 } : {}}
                                                whileTap={!plan.isDisabled ? { scale: 0.95 } : {}}
                                            >
                                                {plan.btnText}
                                            </motion.button>
                                        </div>
                                    </motion.div>
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
                        "Character customization",
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
                    <motion.div
                        className="bg-white rounded-lg p-6 max-w-md w-full relative overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                    >
                        {/* Modal shine effect */}
                        <motion.div
                            className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                            animate={{ left: ['100%', '-50%'] }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                repeatDelay: 3
                            }}
                        />
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
                            <motion.button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={closeModal}
                            >
                                Close
                            </motion.button>
                            <motion.button
                                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center relative overflow-hidden"
                                whileHover={userSubscription?.status === 'active' ? {
                                    scale: 1.05,
                                    boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)"
                                } : {}}
                                whileTap={userSubscription?.status === 'active' ? { scale: 0.95 } : {}}
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
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default Subscription;