import React, { useEffect, useRef } from 'react';

const LandingPage: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: 'url(/LandingBG.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div ref={contentRef} style={{ textAlign: 'center', opacity: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '5%', marginRight: '5%' }}>
                <img src="/SageAI.png" alt="logo" style={{ width: 'auto', height: 'auto' }} className="responsive-logo" />
                <br></br>
                <h1 style={{ fontFamily: 'Medieval', fontSize: '200%', color: 'white', textTransform: 'uppercase' }} className="responsive-text">where stories are guided by <br></br> one's intuition and knowledge</h1>
                <br></br>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button 
                        style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '30px 40px', border: 'none', borderRadius: '5px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: '0.3s' }} 
                        className="shining-button"
                        onClick={() => window.location.href = '/login'}
                    >
                        GATES OF REALM
                    </button>
                    <br></br>
                    <button 
                        style={{ backgroundColor: '#1e1e1e', color: 'white', padding: '30px 40px', border: 'none', borderRadius: '5px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: '0.3s' }} 
                        className="shining-button"
                        onClick={() => window.location.href = '/register'}
                    >
                        ENTER THE WORLD
                    </button>
                    <style>{`
                        .shining-button:hover {
                            box-shadow: 0 0 10px 2px #B28F4C;
                        }
                    `}</style>
                </div>
            </div>
            <style>{`
                @media (max-width: 500px) {
                    .responsive-logo {
                        width: 50%;
                        height: auto;
                    }
                    .responsive-text {
                        font-size: 75%;

                    }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;