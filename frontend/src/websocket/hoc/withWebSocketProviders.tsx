import withWebSocketProvider from './withWebSocketProvider';
import Homepage from '../../home/Homepage';
import UserProfile from '../../profile/UserProfile';
import GameScreen from '../../game/GameScreen';

const HomepageWithWebSocket = withWebSocketProvider(Homepage);
const UserProfileWithWebSocket = withWebSocketProvider(UserProfile);
const GameScreenWithWebSocket = withWebSocketProvider(GameScreen);

export default {
  HomepageWithWebSocket,
  UserProfileWithWebSocket,
  GameScreenWithWebSocket,
};