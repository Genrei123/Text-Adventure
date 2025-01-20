import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("comments");
    const [showUserModal, setShowUserModal] = useState(false);

    return (
        <div className="min-h-screen" style={{ backgroundImage: 'src/assets/UserBG.svg', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Header */}
            <nav className="bg-[#1e1e1e] py-3.5 px-4 shadow-[0_10px_10px_0_rgba(0,0,0,0.75)] z-50">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-cinzel text-[#C8A97E]">
                        Sage.AI
                    </div>
                </div>
            </nav>

            <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <Sidebar />
                <br></br>
                <br></br>
                <br></br>
                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Profile Section */}
                        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
                            <div className="relative">
                                <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border-4 border-[#B39C7D] flex items-center justify-center mx-auto md:mx-0">
                                    <img
                                        src="src/assets/Placeholder.png"
                                        alt="Profile"
                                        width={150}
                                        height={150}
                                        className="rounded-full md:w-[200px] md:h-[200px]"
                                    />
                                    <button
                                        className="absolute bottom-0 right-0 bg-[#B39C7D] text-[#1e1e1e] rounded-full p-2 hover:bg-[#ffffff] transition-colors duration-300"
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*';
                                            input.onchange = (event) => {
                                                const file = event.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => {
                                                        const imgElement = document.querySelector('img[alt="Profile"]');
                                                        imgElement.src = e.target.result;
                                                        imgElement.style.objectFit = 'cover';
                                                        imgElement.style.borderRadius = '50%';
                                                        imgElement.style.width = '100%';
                                                        imgElement.style.height = '100%';
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            };
                                            input.click();
                                        }}
                                    >
                                        <img
                                            src="camera.png"
                                            alt="Edit Profile Picture"
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col items-start mt-4 md:mt-0">
                                <h1 className="text-[#B39C7D] text-4xl font-serif mb-4 self-start">HEADING</h1>
                                <p className="text-[#ffffff]/80 mb-6 self-start text-2xl">
                                    MAIN TEXT
                                </p>
                                <p className="text-[#B39C7D]/80 mb-6 self-start">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                    aliquip ex ea commodo consequat.
                                </p> 
                                <button 
                                    onClick={() => setShowUserModal(true)}
                                    className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
                                >
                                    EDIT PROFILE
                                </button>
                                
                            </div>
                        </div>
                                         
                        {showUserModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="fixed inset-0 bg-black opacity-80"></div>
                                <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg w-[80%] md:w-[350px] relative z-10 border-2 border-[#634630]">
                                    <button
                                        onClick={() => setShowUserModal(false)}
                                        className="absolute top-2 right-2 text-[#B39C7D] hover:text-[#a38b6d] transition-colors duration-300"
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl text-[#B39C7D] mb-4 font-cinzel">EDIT PROFILE</h2>
                                    <form>
                                        <div className="mb-3">
                                            <label className="block text-[#B39C7D] mb-1" htmlFor="username">Username:</label>
                                            <input
                                                type="text"
                                                id="username"
                                                className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-[#B39C7D] mb-1" htmlFor="email">Email:</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-[#B39C7D] mb-1" htmlFor="password">Password:</label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-[#B39C7D] mb-1" htmlFor="confirmPassword">Confirm Password:</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowUserModal(false)}
                                                className="w-full px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Tabs Section */}
                        <div className="w-full">
                            <div className="flex border-b border-[#3A3A3A]">
                                <button
                                    onClick={() => setActiveTab("games")}
                                    className={`px-4 py-2 text-[#ffffff] ${activeTab === "games" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:bg-[#3A3A3A]`}
                                >
                                    YOUR GAMES
                                </button>
                                <button
                                    onClick={() => setActiveTab("comments")}
                                    className={`px-4 py-2 text-[#ffffff] ${activeTab === "comments" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:bg-[#3A3A3A]`}
                                >
                                    YOUR COMMENTS
                                </button>
                                <button
                                    onClick={() => setActiveTab("likes")}
                                    className={`px-4 py-2 text-[#ffffff] ${activeTab === "likes" ? "border-b-2 border-[#B39C7D]" : ""} transition-colors duration-300 ease-in-out hover:bg-[#3A3A3A]`}
                                >
                                    YOUR LIKES
                                </button>
                            </div>
                            {/* uncomment if the comments backend is done */}
                            {/* <div className="mt-4">
                                {activeTab === "comments" && <Comments />}
                                {activeTab === "games" && <div className="text-[#B39C7D]/80 p-4">No games yet</div>}
                                {activeTab === "likes" && <div className="text-[#B39C7D]/80 p-4">No likes yet</div>}
                            </div> */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
