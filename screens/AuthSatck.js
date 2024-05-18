import React, {Component} from 'react';
import PurchasingPage from './PurchasingPage';
import SubmitedPage from './SubmitedPage';
import {createStackNavigator} from '@react-navigation/stack';

const AuthStack = createStackNavigator();

export default class AuthSatck extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AuthStack.Navigator initialRouteName={'PurchasingPage'}>
        <AuthStack.Screen
          name="PurchasingPage"
          component={PurchasingPage}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="SubmitedPage"
          component={SubmitedPage}
          options={{headerShown: false}}
        />
      </AuthStack.Navigator>
    );
  }
}
