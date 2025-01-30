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
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} onClick={() => { document.getElementById('billingModal').style.display = 'block'; document.getElementById('modalOverlay').style.display = 'block'; }}>
                            <img src="/Adventurer.png" alt="Standard Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>adventurer's entry</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}> Gain extra tokens, extended prompt limits, and access to enhanced character options.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>₱100/mo</h2>
                            <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>EMBARK ON YOUR PATH</button>
                        </div>
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} onClick={() => { document.getElementById('billingModal').style.display = 'block'; document.getElementById('modalOverlay').style.display = 'block'; }}>
                            <img src="/Hero.png" alt="Premium Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>hero's journey</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}>Enjoy unlimited prompts, customizable characters, ad-free storytelling, and access to exclusive worlds.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>₱250/mo</h2>
                            <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>BECOME A HERO</button>
                        </div>
                        <div style={{ flex: '0 0 300px', backgroundColor: 'white', height: '600px', maxWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', border: '4px solid #563C2D', transition: 'transform 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} onClick={() => { document.getElementById('billingModal').style.display = 'block'; document.getElementById('modalOverlay').style.display = 'block'; }}>
                            <img src="/Legend.png" alt="Ultimate Plan" style={{ width: '100%', height: 'auto' }} />
                            <h1 style={{ color: '#B28F4C', textAlign: 'center', paddingTop: '1rem', fontFamily: 'Cinzel Decorative, serif', fontWeight: 'bolder', fontSize: '1.5rem' }}>legend's legacy</h1>
                            <p style={{ color: 'black', textAlign: 'center', padding: '0 1rem' }}>Unlock ultimate features including early access to new worlds, personalized storylines, and priority support.</p>
                            <h2 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', fontFamily: 'Playfair Display, serif', fontWeight: 'bold' }}>₱500/mo</h2>
                            <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>FORGE YOUR LEGACY</button>
                        </div>

                    <div id="billingModal" style={{ display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: 1000, border: '5px solid #634630' }}>
                        <button onClick={() => { document.getElementById('billingModal').style.display = 'none'; document.getElementById('modalOverlay').style.display = 'none'; }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#a38b6d' }}>×</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#634630', fontSize: '2rem', fontFamily: 'Cinzel Decorative, serif' }}>billing information</h2>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#634630', float: 'left' }}>Name:</label>
                            <input type="text" placeholder="The name whispered in legends" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '10px', backgroundColor: '#2e2e2e', color: 'white' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#634630', float: 'left'  }}>Email:</label>
                            <input type="email" placeholder="Where to send your quest updates" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '10px', backgroundColor: '#2e2e2e', color: 'white' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#634630' , float: 'left' }}>Address:</label>
                            <input type="text" placeholder="Your secret incantation" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '10px', backgroundColor: '#2e2e2e', color: 'white' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#634630' , float: 'left' }}>Subscription:</label>
                            <input type="text" id="subscriptionInput" readOnly placeholder="Selected subscription" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '10px', backgroundColor: '#2e2e2e', color: 'white' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#634630' , float: 'left' }}>Password:</label>
                            <input type="password" placeholder="your mystical phrase" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '10px', backgroundColor: '#2e2e2e', color: 'white' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <input type="checkbox" id="eula" />
                            <label htmlFor="eula" style={{ color: 'white' }}> I agree on terms</label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '45%', height: '50px', backgroundColor: '#ccc', borderRadius: '10px' }}></div>
                            <div style={{ width: '45%', height: '50px', backgroundColor: '#ccc', borderRadius: '10px' }}></div>
                        </div>
                        <button style={{ width: '100%', padding: '1rem', backgroundColor: '#B39C7D', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '10px' }}>SUBMIT</button>
                    </div>
                    <style>{`
                        @media (max-width: 600px) {
                            #billingModal {
                                height: 90% !important;
                                width: 90%   !important;
                                padding: 0.5rem !important;
                            }
                            #billingModal h2 {
                                font-size: 1.2rem !important;
                            }
                            #billingModal input {
                                padding: 0.2rem !important;
                            }
                            #billingModal button {
                                font-size: 0.8rem !important;
                                padding: 0.4rem !important;
                            }
                            #billingModal label {
                                font-size: 0.8rem !important;
                            }
                            #billingModal #eula {
                                transform: scale(0.8) !important;
                            }
                            #billingModal div[style*="width: '45%'"] {
                                height: 40px !important;
                            }
                        }
                    `}</style>
                    <div id="modalOverlay" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}></div>
                    <script>
                        {`
                            const cards = document.querySelectorAll('div[style*="flex: 0 0 300px"]');
                            const modal = document.getElementById('billingModal');
                            const overlay = document.getElementById('modalOverlay');
                            cards.forEach(card => {
                                card.addEventListener('click', () => {
                                    modal.style.display = 'block';
                                    overlay.style.display = 'block';
                                });
                            });
                            overlay.addEventListener('click', () => {
                                modal.style.display = 'none';
                                overlay.style.display = 'none';
                            });
                        `}
                    </script>
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
