// Just add the routes you want to include in the websocket connection
// The routes should be the same as the ones in the frontend
// Example: '/homepage', '/GameScreen', '/profile', '/active-players'
// For counting active players, you can add the route '/active-players'
// This will allow the backend to count the number of active players on the '/active-players' route

const includedRoutes: string[] = [
  '/home',
  '/game',
  '/profile',
  '/subscription',
  '/game-details',
  '/game-details/:id',
  // Add more routes here
];

export default includedRoutes;