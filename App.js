import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import LoginStackScreen from './login-screen/LoginStackScreen';
import AuthSatck from './screens/AuthSatck';
import {LoginState} from './login-screen/LoginState';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';
import {observables} from './obervables/observables';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class App extends Component {
  state = {loginState: LoginState.init};

  componentDidMount() {
    this.getUserData();

    this.loginStateObservable = observables
      .getLoginStateObservable()
      .subscribe(res => {
        this.setState({loginState: res});
      });
  }

  componentWillUnmount() {
    this.loginStateObservable.unsubscribe();
  }

  async getUserData() {
    let data = await AsyncStorage.getItem('isLogged');
    if (JSON.parse(data)) {
      console.log('isLogged');
      this.setState({loginState: LoginState.loggedIn});
    } else {
      console.log('notIsLogged');
      this.setState({loginState: LoginState.need_login});
    }
  }

  render() {
    return (
      <NavigationContainer
        fallback={
          <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator color={'white'} size="small" />
          </SafeAreaView>
        }>
        {this.state.loginState === LoginState.init ? (
          <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator color={'white'} size="large" />
          </SafeAreaView>
        ) : null}
        {this.state.loginState === LoginState.need_login ? (
          <LoginStackScreen />
        ) : null}
        {this.state.loginState === LoginState.loggedIn ? <AuthSatck /> : null}
      </NavigationContainer>
    );
  }
}
