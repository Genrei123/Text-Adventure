// Just add the routes you want to include in the websocket connection
// The routes should be the same as the ones in the frontend
// Example: '/homepage', '/GameScreen', '/profile', '/active-players'
// For counting active players, you can add the route '/active-players'
// This will allow the backend to count the number of active players on the '/active-players' route

const includedRoutes = [
  '/homepage',
  '/gameScreen',
  '/profile',
  // Add more routes here
];

module.exports = includedRoutes;