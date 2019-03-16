import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import NoInternet from './components/NoInternet';
import { App } from './App';

class ReduxNavigation extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  };

  state = {
    isConnected: true,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  onBackPress = () => {
    const { dispatch, state } = this.props;
    if (state.index === 0) {
      Alert.alert(
        'Exit Application',
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {
          cancelable: false,
        },
      );
      return true;
    }

    dispatch(NavigationActions.back());
    return true;
  };

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  checkNetwork = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isConnected });
    });
  };

  render() {
    const { dispatch, state } = this.props;
    const { isConnected } = this.state;
    if (!isConnected) {
      return <NoInternet checkNetwork={this.checkNetwork} />;
    }
    return <App dispatch={dispatch} state={state} />;
  }
}

const mapStateToProps = state => ({
  state: state.nav,
});

export default connect(mapStateToProps)(ReduxNavigation);
