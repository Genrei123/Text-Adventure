import React from 'react';

const Subscription: React.FC = () => {
    return (
        <div style={{ backgroundImage: 'url(Billings.png)', backgroundSize: 'cover', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '1rem', marginTop: '5rem', fontSize: '2rem', fontFamily: 'Cinzel Decorative, serif' }}>
                    find your path
                </h2>
                <br></br>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: 'white', height: '600px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src="path/to/image.jpg" alt="Basic Plan" style={{ width: '100%', height: 'auto' }} />
                        <h3 style={{ color: 'black', textAlign: 'center', paddingTop: '1rem' }}>Basic Plan</h3>
                        <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>Select</button>
                    </div>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: 'white', height: '600px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src="path/to/image.jpg" alt="Standard Plan" style={{ width: '100%', height: 'auto' }} />
                        <h3 style={{ color: 'black', textAlign: 'center', paddingTop: '1rem' }}>Standard Plan</h3>
                        <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>Select</button>
                    </div>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: 'white', height: '600px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src="path/to/image.jpg" alt="Premium Plan" style={{ width: '100%', height: 'auto' }} />
                        <h3 style={{ color: 'black', textAlign: 'center', paddingTop: '1rem' }}>Premium Plan</h3>
                        <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>Select</button>
                    </div>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: 'white', height: '600px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src="path/to/image.jpg" alt="Ultimate Plan" style={{ width: '100%', height: 'auto' }} />
                        <h3 style={{ color: 'black', textAlign: 'center', paddingTop: '1rem' }}>Ultimate Plan</h3>
                        <button style={{ width: '90%', backgroundColor: 'black', color: 'white', padding: '1rem', border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '5%' }}>Select</button>
                    </div>
                </div>
            </div>
            {/* <div style={{ maxWidth: '1200px', margin: '10px auto', marginTop: '10rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: '#634630', height: '600px', minWidth: '300px' }}>
                        <h3 style={{ color: 'white', textAlign: 'center', paddingTop: '1rem' }}>Basic Plan</h3>
                    </div>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: '#634630', height: '600px', minWidth: '300px' }}>
                        <h3 style={{ color: 'white', textAlign: 'center', paddingTop: '1rem' }}>Standard Plan</h3>
                    </div>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: '#634630', height: '600px', minWidth: '300px' }}>
                        <h3 style={{ color: 'white', textAlign: 'center', paddingTop: '1rem' }}>Premium Plan</h3>
                    </div>
                    <div style={{ flex: '1 1 calc(25% - 1rem)', backgroundColor: '#634630', height: '600px', minWidth: '300px' }}>
                        <h3 style={{ color: 'white', textAlign: 'center', paddingTop: '1rem' }}>Ultimate Plan</h3>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Subscription;
