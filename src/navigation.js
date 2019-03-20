import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';
import DockScreen from './screens/DockScreen';
import DineScreen from './screens/DineScreen';
import ServicesScreen from './screens/ServicesScreen';
import CitySearch from './screens/CitySearch';
import MarinaScreen from './screens/MarinaScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import NearByScreen from './screens/NearByScreen';
import CityList from './screens/CityList';
import BusinessList from './screens/BusinessList';

const AppStack = createStackNavigator(
  {
    Main: MainScreen,
    Dock: DockScreen,
    Dine: DineScreen,
    Services: ServicesScreen,
    Marina: MarinaScreen,
    Categories: CategoriesScreen,
    NearBy: NearByScreen,
    CityList,
    CitySearch,
    BusinessList,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
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
