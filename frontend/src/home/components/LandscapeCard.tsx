import React from "react";
import { samplePortraitCardData } from "../types/Story"; // Adjust path if needed

const LandscapeCard: React.FC = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
      {samplePortraitCardData.map(({ title, description, summary, genre, imageUrl }, index) => (
        <div
          key={index}
          className="landscape-card"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: "600px",
            border: "1px solid #C8A97E",
            borderRadius: "16px",
            padding: "0",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#563C2D",
            color: "white",
            overflow: "hidden",
            position: "relative",
            verticalAlign: "top",
          }}
        >
          {/* Image Section */}
          <div
            style={{
              width: "40%", // Adjust for balance
              height: "auto",
              overflow: "hidden",
              aspectRatio: "16/9",
            }}
          >
            <img
              src={imageUrl || "gradient.png"}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Text Content */}
          <div style={{ padding: "16px", width: "60%" }}>
            <h5
              className="landscape-card-title"
              style={{
                margin: "8px 0",
                fontSize: "1.5em",
                fontFamily: "Cinzel Decorative, sans-serif",
                color: "#B28F4C",
                fontWeight: "bold",
              }}
            >
              {title}
            </h5>
            <p
              className="landscape-card-description"
              style={{
                margin: "8px 0",
                fontFamily: "Fairplay Display, sans-serif",
                color: "#C9B57B",
              }}
            >
              {description}
            </p>
            <p
              className="landscape-card-summary"
              style={{
                margin: "8px 0",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "Poppins, sans-serif",
                height: "4.5em", // Assuming line-height is 1.5em
              }}
            >
              {summary}
            </p>

            {summary.split("\n").length > 3 && (
              <p
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                See more
              </p>
            )}

            <br />
            {/* Genre Tags */}
            <div
              className="landscape-card-genres"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                margin: "8px 0",
                fontFamily: "Cinzel",
              }}
            >
              {genre.split(",").map((g, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    color: "white",
                    borderRadius: "8px",
                    textAlign: "center",
                    minWidth: "50px",
                  }}
                >
                  {g.trim()}
                </div>
              ))}
            </div>

            {/* Explore Button */}
            <button
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                width: "100%",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "white";
                (e.target as HTMLButtonElement).style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "black";
                (e.target as HTMLButtonElement).style.color = "white";
              }}
            >
              Explore
            </button>
          </div>
        </div>
      ))}

      {/* Responsive & Scrollbar Styling */}
      <style>{`
                @media (max-width: 768px) {
                    .landscape-card {
                        flex-direction: column;
                        max-width: 100%;
                    }

                    .landscape-card img {
                        width: 100%;
                        height: auto;
                    }
                }

                /* Custom scrollbar styles */
                .landscape-card::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                .landscape-card::-webkit-scrollbar-track {
                    background: transparent;
                }

                .landscape-card::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 10px;
                    border: 2px solid transparent;
                }

                .landscape-card::-webkit-scrollbar-thumb:hover {
                    background-color: #555;
                }
            `}</style>
    </div>
  );
};

export default LandscapeCard;
