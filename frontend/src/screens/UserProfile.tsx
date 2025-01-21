import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("comments");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null); // Correctly typing the cropper ref

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

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper; // Access the cropper instance
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL();
      const imgElement = document.querySelector('img[alt="Profile"]') as HTMLImageElement | null;
      if (imgElement) {
        imgElement.src = croppedImage;
        imgElement.style.objectFit = "cover";
        imgElement.style.borderRadius = "50%";
      }
    }
    setShowCropModal(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "src/assets/UserBG.svg",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <nav className="bg-[#1e1e1e] py-3.5 px-4 shadow-[0_10px_10px_0_rgba(0,0,0,0.75)] z-50">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-cinzel text-[#C8A97E]">Sage.AI</div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />
        <br />
        <br />
        <br />
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
                <h1 className="text-[#B39C7D] text-4xl font-serif mb-4 self-start">
                  HEADING
                </h1>
                <p className="text-[#ffffff]/80 mb-6 self-start text-2xl">
                  MAIN TEXT
                </p>
                <p className="text-[#B39C7D]/80 mb-6 self-start">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
                >
                  EDIT PROFILE
                </button>
              </div>
            </div>

            {/* Crop Modal */}
            {showCropModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-[#1e1e1e] opacity-80"></div>
                <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg w-[90%] md:w-[600px] relative z-10 border-4 border-[#B39C7D]"> {/* Added border */}
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
                      className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
                    >
                      Crop and Save
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
                        </div>
          </div>
        </main>
      </div>
    </div>
  );
}
