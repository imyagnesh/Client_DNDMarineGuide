import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';
import DockScreen from './screens/DockScreen';
import DineScreen from './screens/DineScreen';
import ServicesScreen from './screens/ServicesScreen';

const DockStack = createStackNavigator(
  {
    DockScreen,
  },
  {
    initialRouteName: 'IntroPage',
  },
);

const DineStack = createStackNavigator(
  {
    DineScreen,
  },
  {
    initialRouteName: 'IntroPage',
  },
);

const ServicesStack = createStackNavigator(
  {
    ServicesScreen,
  },
  {
    initialRouteName: 'IntroPage',
  },
);

const AppStack = createStackNavigator(
  {
    Main: MainScreen,
    Dock: DockStack,
    Dine: DineStack,
    Services: ServicesStack,
  },
  {
    initialRouteName: 'Main',
  },
);

const SwitchNavigator = createSwitchNavigator(
  {
    Splash: SplashScreen,
    App: AppStack,
  },
  {
    initialRouteName: 'Splash',
  },
);

export default createAppContainer(SwitchNavigator);
