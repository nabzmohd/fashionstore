import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, Icon, Image, Input} from 'react-native-elements';
import {observables} from '../obervables/observables';
import {LoginState} from './LoginState';
import {styles} from './styles';

export default class LoginScreen extends Component {
  state = {
    emailErrorMsg: '',
    passwordErrorMsg: '',
    onLogin: false,
    email: '',
    password: '',
    showPassword: false,
    isVisible: false,
  };

  _showEmailFieldError() {
    this.setState({emailErrorMsg: 'Enter a valid email address'});
  }

  _showPasswordFieldError() {
    this.setState({
      passwordErrorMsg: 'Password must be at least 6 characters long',
    });
  }

  async _onLoginPress() {
    if (!this.state.email) this._showEmailFieldError();
    if (!this.state.password) this._showPasswordFieldError();
    if (!this.state.email || !this.state.password) return;

    var pattern = new RegExp(
      '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$',
    );
    if (!pattern.test(this.state.email)) {
      this._showEmailFieldError();
      return;
    }
    if (this.state.password.length < 6) {
      this._showPasswordFieldError();
      return;
    }
    this.setState({onLogin: true});

    let data = await AsyncStorage.getItem('users');

    if (data) {
      let users = JSON.parse(data);
      let index = users.findIndex(user => user?.email === this.state.email);
      if (index > -1) {
        //  user found with same email
        let user = users[index];
        if (user.password === this.state.password) {
          await AsyncStorage.setItem('isLogged', JSON.stringify(true));
          observables.triggerLoginStateObservable(LoginState.loggedIn);
        } else {
          this.setState({
            passwordErrorMsg: 'Incorrect Password',
            onLogin: false,
          });
        }
      } else {
        this.setState({
          emailErrorMsg: 'No user found with this email',
          onLogin: false,
        });
      }
    } else {
      this.setState({
        emailErrorMsg: 'No user found with this email',
        onLogin: false,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{height: 190}} source={require('../images/logo.png')} />

        <View style={{flex: 2, marginTop: 20}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps={'handled'}>
            <Text style={styles.heading}>SIGN IN</Text>
            <View style={{height: '100%', width: '100%'}}>
              <Input
                ref={input => (this.emailField = input)}
                placeholder="User Name"
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                blurOnSubmit={false}
                onSubmitEditing={() => this.passwordField.focus()}
                onChangeText={value => {
                  this.setState({
                    emailErrorMsg: '',
                    email: value.trim(),
                  });
                }}
                errorStyle={{color: 'red'}}
                errorMessage={this.state.emailErrorMsg}
                placeholderTextColor={'rgba(50, 50, 50, 0.6)'}
                inputContainerStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  padding: 3,
                  height: 55,
                }}
              />
              <Input
                ref={input => (this.passwordField = input)}
                placeholder="Password"
                rightIcon={
                  <Icon
                    name={this.state.showPassword ? 'eye-off' : 'eye'}
                    type="ionicon"
                    color={'#000'}
                    onPress={() => {
                      this.setState({
                        showPassword: !this.state.showPassword,
                      });
                    }}
                  />
                }
                autoCapitalize="none"
                secureTextEntry={!this.state.showPassword}
                onChangeText={value => {
                  this.setState({
                    passwordErrorMsg: '',
                    password: value.trim(),
                  });
                }}
                errorMessage={this.state.passwordErrorMsg}
                errorStyle={{color: 'red'}}
                placeholderTextColor={'rgba(50, 50, 50, 0.6)'}
                inputContainerStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  padding: 3,
                  height: 55,
                }}
              />

              <Button
                type={'solid'}
                title="LOG IN"
                onPress={this._onLoginPress.bind(this)}
                loading={this.state.onLogin}
                raised
                buttonStyle={{
                  backgroundColor: 'green',
                  borderRadius: 5,
                }}
                containerStyle={{borderRadius: 5, marginHorizontal: 15}}
              />

              <View style={{alignItems: 'center', marginVertical: 20}}>
                <Text
                  style={{
                    fontSize: 11,
                    color: '#000',
                  }}>
                  Don't have an account?{' '}
                  <Text
                    onPress={() =>
                      this.props.navigation.navigate('SignUpScreen')
                    }
                    style={{
                      color: '#000',
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    Sign Up
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
