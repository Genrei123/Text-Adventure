import React from 'react';

const Subscription: React.FC = () => {
    return (
        <div style={{ backgroundImage: 'url(Billings.png)', backgroundSize: 'cover', minHeight: '100vh', padding: '1rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '1rem', marginTop: '5rem', fontSize: '3rem', fontFamily: 'Cinzel Decorative, serif' }}>
                    find your path
                </h2>
                <h4 style={{ textAlign: 'center', color: 'white', marginTop: '1rem', fontSize: '1rem', fontFamily: 'Cinzel Decorative, serif' }}>
                    unlock your full potential 
                </h4>
                <br></br>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            <img src="/Freemium.png" alt="Basic Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>freedom sword</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}>Begin your journey with 2000 tokens worth of free prompts and basic world access.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>FREE</h2>
                            <button style={{ width: '90%', backgroundColor: 'green', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>CURRENT PATH</button>
                        </div>
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            <img src="/Adventurer.png" alt="Standard Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>adventurer's entry</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}> Gain extra tokens, extended prompt limits, and access to enhanced character options.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>₱100/mo</h2>
                            <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>EMBARK ON YOUR PATH</button>
                        </div>
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            <img src="/Hero.png" alt="Premium Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>hero's journey</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}>Enjoy unlimited prompts, customizable characters, ad-free storytelling, and access to exclusive worlds.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>₱250/mo</h2>
                            <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>BECOME A HERO</button>
                        </div>
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            <img src="/Legend.png" alt="Ultimate Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>legend's legacy</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}>Unlock ultimate features including early access to new worlds, personalized storylines, and priority support.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>₱500/mo</h2>
                            <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>FORGE YOUR LEGACY</button>
                        </div>
                    </div>
                    <style>{`
                        @media (max-width: 600px) {
                            div[style*="flex: 0 0 300px"] {
                                flex: 0 0 100% !important;
                                height: auto !important;
                                flex-direction: column !important;
                                align-items: center !important;
                                overflow: hidden !important;
                            }
                            div[style*="flex: 0 0 300px"] img {
                                width: 100% !important;
                                height: auto !important;
                            }
                            div[style*="flex: 0 0 300px"] h1, 
                            div[style*="flex: 0 0 300px"] p, 
                            div[style*="flex: 0 0 300px"] h2, 
                            div[style*="flex: 0 0 300px"] button {
                                width: 90% !important;
                                text-align: center !important;
                                padding-left: 0 !important;
                            }
                            div[style*="flex: 0 0 300px"] button {
                                margin-bottom: 5% !important;
                            }
                        }
                    `}</style>
            </div>               
        </div>
        
        
    );
};

export default Subscription;
