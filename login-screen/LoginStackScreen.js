import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const LoginStack = createStackNavigator();

export default class LoginStackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LoginStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'LoginScreen'}>
        <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
        <LoginStack.Screen name="SignUpScreen" component={SignUpScreen} />
      </LoginStack.Navigator>
    );
  }
}
