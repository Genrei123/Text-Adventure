# Description
Story Adaptive Game Engine or SAGE utilizes artificial intelligence story creation capabilities. It aims to bring ''story'' imaginations into reality by prompting the idea of the story, the description, and the ending. Led a team of 9 developers where we crafted and curated high-quality datasets for training AI model, and also developed a user-friendly and visually appealing web-based interface using React, Node.js and PostgreSQL that provides seamless interactions with players.

# Features
- The user is able to log-in and register and can perform SSO with Google
- The user is able to add their own game with their own title, description and ending
- The user is able to write prompts to generate texts and images
- The user's currency is a ''token/weavel'' which is used for transactions with the AI
- The administrator of the website can add, update and revoke games according to their preferences
- The administrator is able to view the count and the activity of the website

## What does this offer?
This web application is aimed at the general public but is focused on games who prefer role-playing or story type games.

## Challenge
The main struggle in this system is the deployment of the trained model. We have to learn and understand how we can use NGROK or CLOUDFLARE TUNNELING to expose the server's model to effectively use in the website.

## Solution
We utilized NGROK to expose the server's port so that the website can utilize the image generation capabilities..
