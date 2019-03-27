import React from 'react';
import { Text, Image, View, PixelRatio } from 'react-native';
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
import BusinessDetails from './screens/BusinessDetails';

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
    BusinessDetails,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#5DAFDE',
      },
      headerTintColor: '#FFF',
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            resizeMode="contain"
            style={{ flex: 1, height: null, width: null, aspectRatio: PixelRatio.get() }}
            source={require('./img/LogoSM.png')}
          />
        </View>
      ),
    },
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
