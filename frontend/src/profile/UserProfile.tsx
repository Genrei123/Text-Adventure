import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import YourGames from "./components/YourGames";
import YourComments from "./components/YourComments";
import YourLikes from "./components/YourLikes";
import axios from '../../config/axiosConfig';
import Navbar from "../components/Navbar";
import { FaSpinner } from 'react-icons/fa';

interface UserDetails {
  id: number;
  username: string;
  email: string;
  bio?: string;
  image_url?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("games");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { username } = useParams<{ username: string }>();

  const navigate = useNavigate();

  const handleCopyUsername = () => {
    const usernameElement = document.querySelector('h1') as HTMLElement;
    if (usernameElement) {
      navigator.clipboard.writeText(usernameElement.innerText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/admin/users/username/${username}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/forbidden');
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setShowCropModal(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      // Convert cropped image to blob
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          // Ensure the field name matches what the backend expects
          formData.append('image', blob, 'profile.jpg');
  
          try {
            setImageLoading(true);
            const response = await axios.post('/image/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
  
            // Update user details with new image URL
            setUserDetails(prev => prev ? {
              ...prev,
              image_url: response.data.imageUrl
            } : null);
  
            setShowCropModal(false);
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload profile picture');
          } finally {
            setImageLoading(false);
          }
        }
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900"
      style={{
        backgroundImage: "url(/UserBG.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
              <div className="relative">
                <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border-4 border-[#B39C7D] flex items-center justify-center mx-auto md:mx-0">
                  {imageLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <FaSpinner className="animate-spin text-[#B39C7D] text-3xl" />
                    </div>
                  ) : (
                    <img
                      src={userDetails?.image_url || "/null_Icon.svg"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                  
                  <button
                    className="absolute bottom-0 right-0 bg-[#B39C7D] text-[#1e1e1e] rounded-full p-2 hover:bg-[#ffffff] transition-colors duration-300"
                    onClick={handleImageUpload}
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
              <div className="flex items-center">
              
              <h1 className="text-[#B39C7D] text-4xl font-serif mb-4 self-start">
                {userDetails?.username || 'Username'}
              </h1>
              <div className="flex items-center">
                <button
                className="ml-2 text-[#1e1e1e] rounded-full p-2 hover:bg-[#ffffff] transition-colors duration-300 relative"
                onClick={handleCopyUsername}
                >
                <img src="copy.svg" alt="Copy Username" className="w-4 h-4" />
                  {copied && (
                  <div className="fixed inset-0 flex items-center z-50">
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#B39C7D] text-[#1e1e1e] text-lg px-4 py-2 rounded shadow-lg animate-fadeIn">
                      Copied to Clipboard
                    </div>
                  </div>
                  )}
                
                </button>
              </div>
              </div>

                <p className="text-[#ffffff]/80 mb-6 self-start text-2xl">
                {userDetails?.email || 'Email'}
                </p>

                <p className="text-[#ffffff]/80 mb-4 text-left text-xl">
                {userDetails?.bio
                  ? userDetails.bio.match(/.{1,40}/g)?.map((line, index) => (
                  <span key={index}>{line}<br /></span>
                  ))
                  : <span style={{ opacity: 0.2 }}>Add a bio to tell others more about yourself.</span>}
                </p>
                <button
                onClick={() => setShowBioModal(true)}
                className="text-[#B39C7D]/80 mb-6 self-start bg-transparent border-none cursor-pointer"
                >
                {userDetails?.bio ? <span style={{ opacity: 0.8 }}>Edit Bio</span> : <span style={{ opacity: 0.8 }}>Add Bio</span>}
                </button>
                {showBioModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
                <div className="fixed inset-0 bg-black opacity-80"></div>
                <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg w-[400px] relative z-10 border-2 border-[#634630]">
                <button
                onClick={() => setShowBioModal(false)}
                className="absolute top-2 right-2 text-[#B39C7D] hover:text-[#a38b6d] transition-colors duration-300"
                >
                &times;
                </button>
                <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">Describe Yourself</h2>
                <form
                  onSubmit={(e) => {
                  e.preventDefault();
                  const bioInput = (e.target as HTMLFormElement).elements.namedItem("bio") as HTMLTextAreaElement;
                  setUserDetails((prevDetails) => prevDetails ? { ...prevDetails, bio: bioInput.value } : null);
                  setShowBioModal(false);
                  }}
                >
                <div className="mb-4">
                <label className="block text-[#B39C7D] mb-2" htmlFor="bio">Bio:</label>
                <textarea
                  id="bio"
                  maxLength={60}
                  defaultValue={userDetails?.bio || ""}
                  className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                />
                <small className="block text-[#B39C7D] mt-2">Limit: 60 characters</small>
                </div>
                <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
                >
                  Submit
                </button>
                </div>
                </form>
                </div>
                </div>
                )}

              <button
                onClick={() => setShowUserModal(true)}
                className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
              >
                EDIT PROFILE
              </button>
              </div>
            </div>

            {showUserModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
              <div className="fixed inset-0 bg-black opacity-80"></div>
              <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg w-[400px] relative z-10 border-2 border-[#634630]">
                <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-2 right-2 text-[#B39C7D] hover:text-[#a38b6d] transition-colors duration-300"
                >
                &times;
                </button>
                <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">EDIT PROFILE</h2>
                <form>
                <div className="mb-4">
                  <label className="block text-[#B39C7D] mb-2" htmlFor="username">Username:</label>
                  <input
                  type="text"
                  id="username"
                  className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#B39C7D] mb-2" htmlFor="email">Email:</label>
                  <input
                  type="email"
                  id="email"
                  className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#B39C7D] mb-2" htmlFor="password">Password:</label>
                  <input
                  type="password"
                  id="password"
                  className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#B39C7D] mb-2" htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-2 rounded bg-[#2e2e2e] text-[#ffffff]"
                  />
                </div>
                <br></br>
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

            <style>{`
              @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
              }
              .animate-fadeIn {
              animation: fadeIn 0.5s ease-in-out;
              }
              @keyframes fadeOut {
                from {
                  opacity: 1;
                }
                to {
                  opacity: 0;
                }
              }
              .animate-fadeOut {
                animation: fadeOut 0.5s ease-in-out;
              }
            `}</style>

            {/* Crop Modal */}
            {showCropModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="fixed inset-0 bg-[#1e1e1e] opacity-80"></div>
                  <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg w-[90%] md:w-[600px] relative z-10 border-4 border-[#B39C7D]">
                    <button
                      onClick={() => setShowCropModal(false)}
                      className="absolute top-2 right-2 text-[#B39C7D] hover:text-[#a38b6d] transition-colors duration-300"
                    >
                      &times;
                    </button>
                    <h2 className="text-xl text-[#B39C7D] mb-4 font-cinzel">
                      Crop Your Profile Picture
                    </h2>
                    {selectedImage && (
                      <Cropper
                        src={selectedImage}
                        style={{ height: 400, width: "100%" }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        guides={false}
                        viewMode={1}
                        dragMode="move"
                        background={false}
                        ref={cropperRef}
                      />
                    )}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleCrop}
                        disabled={imageLoading}
                        className={`px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300 ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {imageLoading ? 'Uploading...' : 'Crop and Save'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Additional Sections */}
            {/* Tabs Section */}
            <div className="w-full">
              <div className="flex border-b border-[#3A3A3A]">
                <button
                  onClick={() => setActiveTab("games")}
                  className={`px-4 py-2 text-[#ffffff] ${activeTab === "games" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(179,156,125,0.75)] rounded-full bg-transparent`}
                >
                  GAMES
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-4 py-2 text-[#ffffff] ${activeTab === "comments" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(179,156,125,0.75)] rounded-full bg-transparent`}
                >
                  COMMENTS
                </button>
                {/* <button
                  onClick={() => setActiveTab("likes")}
                  className={`px-4 py-2 text-[#ffffff] ${activeTab === "likes" ? "border-b-2 border-[#B39C7D]" : ""} mr-4 transition-colors duration-300 ease-in-out hover:shadow-[0_0_10px_2px_rgba(179,156,125,0.75)] rounded-full bg-transparent`}
                >
                  LIKES
                </button> */}
              </div>
            </div>
            <div className="mt-4">
              {activeTab === "games" && (
                <div>
                  <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">Games</h2>
                  <YourGames />
                </div>
              )}
            </div>
            {activeTab === "comments" && (
              <div>
                <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">Comments</h2>
                <YourComments />
              </div>
            )}
            {activeTab === "likes" && (
              <div>
                <h2 className="text-2xl text-[#B39C7D] mb-4 font-cinzel">Likes</h2>
                <YourLikes />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}