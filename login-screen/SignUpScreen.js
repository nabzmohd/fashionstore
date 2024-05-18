import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, Icon, Image, Input} from 'react-native-elements';
import {styles} from './styles';
import {observables} from '../obervables/observables';
import {LoginState} from './LoginState';

export default class SignUpScreen extends Component {
  state = {
    email: '',
    password: '',
    passwordErrorMsg: '',
    confirmpasswordErrorMsg: '',
    confirmpassword: '',
    emailErrorMsg: '',
    showPassword: false,
    onLogin: false,
  };

  isPasswordmatched(firstPassword, confirmpasword) {
    if (firstPassword !== confirmpasword) {
      return false;
    }
    return true;
  }

  _onValidation() {
    var pattern = new RegExp(
      '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$',
    );
    const password = this.state.password.trim();
    const confPassword = this.state.confirmpassword.trim();
    if (
      !this.state.email ||
      !this.state.password ||
      !this.isPasswordmatched(
        this.state.password,
        this.state.confirmpassword,
      ) ||
      this.state.password.length < 6
    ) {
      this.setState({
        passwordErrorMsg:
          password.length < 6
            ? password.length === 0
              ? 'Password required'
              : 'Password must be at least 6 characters long'
            : '',
        confirmpasswordErrorMsg:
          password !== confPassword ? 'Password mismatch' : '',
        emailErrorMsg: !this.state.email
          ? 'email required'
          : !pattern.test(this.state.email)
          ? 'Enter a valid email'
          : '',
      });
      return;
    }
    if (!pattern.test(this.state.email)) {
      this.setState({emailErrorMsg: 'Enter a valid email'});
      return;
    }
    this._onSignUpCalled();
  }

  async _onSignUpCalled() {
    this.setState({onLogin: true});
    let req = {
      email: this.state.email,
      password: this.state.password,
    };
    let users = [];
    let data = await AsyncStorage.getItem('users');
    if (data) users = JSON.parse(data);
    users.push(req);

    await AsyncStorage.setItem('isLogged', JSON.stringify(true));
    AsyncStorage.setItem('users', JSON.stringify(users)).then(res => {
      console.log('res', res);
      observables.triggerLoginStateObservable(LoginState.loggedIn);
    });
    this.setState({onLogin: false});
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{height: 190}} source={require('../images/logo.png')} />
        <View style={{flex: 2, marginTop: 20}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps={'handled'}>
            <Text style={styles.heading}>SIGN UP</Text>
            <View style={{height: '100%', width: '100%'}}>
              <Input
                ref={input => (this.userNameField = input)}
                placeholder="Email"
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize="none"
                blurOnSubmit={false}
                value={this.state.email}
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
                value={this.state.password}
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
              <Input
                ref={input => (this.confirmPasswordField = input)}
                placeholder="Confirm Password"
                secureTextEntry={true}
                returnKeyType="done"
                autoCapitalize="none"
                blurOnSubmit={true}
                onSubmitEditing={() => {}}
                onChangeText={value => {
                  this.setState({
                    confirmpasswordErrorMsg: '',
                    confirmpassword: value.trim(),
                  });
                }}
                errorMessage={this.state.confirmpasswordErrorMsg}
                errorStyle={{color: 'red'}}
                placeholderTextColor={'rgba(50, 50, 50, 0.6)'}
                inputContainerStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  padding: 3,
                  height: 55,
                }}
                containerStyle={{marginTop: 10}}
              />
              <Button
                type={'solid'}
                title="SIGN UP"
                onPress={this._onSignUpCalled.bind(this)}
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
                  Already have an account?{' '}
                  <Text
                    onPress={() =>
                      this.props.navigation.navigate('LoginScreen')
                    }
                    style={{
                      color: '#000',
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    Sign In
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
