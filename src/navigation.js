import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';
import DockScreen from './screens/DockScreen';
import DineScreen from './screens/DineScreen';
import CategoryList from './screens/CategoryList';
import CityScreen from './screens/CityScreen';
import MarinaList from './screens/MarinaList';
import CategoriesScreen from './screens/CategoriesScreen';
import NearByScreen from './screens/NearByScreen';
import CityList from './screens/CityList';
import BusinessList from './screens/BusinessList';

const AppStack = createStackNavigator(
  {
    Main: MainScreen,
    Dock: DockScreen,
    Dine: DineScreen,
    Categories: CategoriesScreen,
    NearBy: NearByScreen,
    Cities: CityScreen,
    CityList,
    BusinessList,
    CategoryList,
    MarinaList,
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
