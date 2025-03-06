import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OfferModal from './OfferModal';
import LoadingScreen from '../components/LoadingScreen';

const Subscription: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [fadeIn, setFadeIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const handlePlanClick = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    useEffect(() => {
        // Simulate loading time
        setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setIsInitialLoading(false);
            }, 500);
        }, 2000);
    }, []);

    if (isInitialLoading) {
        return <LoadingScreen fadeIn={fadeIn} fadeOut={fadeOut} />;
    }

    return (
        <>
            <Navbar />
            <div className="bg-cover min-h-screen p-4" style={{ backgroundImage: 'url(Billings.png)' }}>
                <Sidebar />
                <div className="max-w-7xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-cinzel my-10">Find Your Path</h2>
                    <h4 className="text-lg md:text-xl font-cinzel mb-6">Unlock Your Full Potential</h4>

                    <div className="flex flex-wrap justify-center gap-8 mt-6">
                        {[
                            { title: "Freedom Sword", desc: "Begin your journey with 2000 tokens worth of free prompts and basic world access.", price: "FREE", img: "/Freemium.png", btnText: "CURRENT PATH", btnColor: "bg-green-600" },
                            { title: "Adventurer's Entry", desc: "Gain extra tokens, extended prompt limits, and access to enhanced character options.", price: "₱100/mo", img: "/Adventurer.png", btnText: "EMBARK ON YOUR PATH", btnColor: "bg-black" },
                            { title: "Hero's Journey", desc: "Enjoy unlimited prompts, customizable characters, ad-free storytelling, and access to exclusive worlds.", price: "₱250/mo", img: "/Hero.png", btnText: "BECOME A HERO", btnColor: "bg-black" },
                            { title: "Legend's Legacy", desc: "Unlock ultimate features including early access to new worlds, personalized storylines, and priority support.", price: "₱500/mo", img: "/Legend.png", btnText: "FORGE YOUR LEGACY", btnColor: "bg-black" }
                        ].map((plan, index) => (
                            <div key={index} className="bg-white w-72 p-6 rounded-lg shadow-lg border-4 border-[#563C2D] transform transition-transform hover:scale-110" onClick={() => handlePlanClick(plan)}>
                                <img src={plan.img} alt={plan.title} className="w-full" />
                                <h1 className="text-[#B28F4C] text-center text-xl font-bold font-cinzel mt-4">{plan.title}</h1>
                                <p className="text-black text-center p-2">{plan.desc}</p>
                                <h2 className="text-black text-center text-2xl font-bold font-playfair">{plan.price}</h2>
                                <button className={`w-full text-white p-2 rounded-md mt-4 ${plan.btnColor}`}>{plan.btnText}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <OfferModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    offerType={selectedPlan.title}
                    subcontext={selectedPlan.desc}
                    features={["Feature 1", "Feature 2", "Feature 3"]}
                    plans={[
                        { duration: "1 Month", credit: "1000 tokens", cost: "₱100" },
                        { duration: "3 Months", credit: "3000 tokens", cost: "₱250" },
                        { duration: "1 Year", credit: "12000 tokens", cost: "₱900" }
                    ]}
                />
            )}
        </>
    );
};

export default Subscription;
