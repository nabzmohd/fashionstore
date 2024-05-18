import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {LoginState} from '../login-screen/LoginState';
import {observables} from '../obervables/observables';
import PurchaseItem from './PurchaseItem';
import {styles} from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';

export default class PurchasingPage extends Component {
  state = {
    customerName: '',
    customerNameArray: [],
    showCoustomerNameList: false,
    grandTotal: 0,
    userErrorMsg: '',
    enableSaveBtn: true,
  };

  _customerName = [
    'Oliver',
    'Jake',
    'Jack',
    'Noah',
    'Liam',
    'John',
    'James',
    'Connor',
    'Michael',
  ];

  ordersMap = {
    order: [
      {
        productName: '',
        quantity: 1,
        price: 0,
      },
    ],
  };

  searchCoustomerName(text) {
    const filteredData = this._customerName.filter(item =>
      item.toLowerCase().includes(text.toLowerCase()),
    );

    this.setState({
      customerName: text,
      showCoustomerNameList: true,
      customerNameArray: filteredData,
      userErrorMsg: filteredData?.length === 0 ? 'User not found' : '',
    });
  }

  async onLogout() {
    console.log('log bbb');
    await AsyncStorage.setItem('isLogged', JSON.stringify(false));
    observables.triggerLoginStateObservable(LoginState.need_login);
  }

  onAddMorePressed(index) {
    if (this.isProductNameValid(index)) {
      console.log('ADD MORE CATEGORY');
      this.ordersMap.order.push({
        productName: '',
        quantity: 1,
        price: 0,
      });
    }
    this.setState({canShowCategories: true});
  }

  isProductNameValid(index) {
    let order = this.ordersMap.order[index];

    if (!order.productName) {
      order.errorMessage = 'Enter product name';
      return false;
    }
    return true;
  }

  render() {
    let {
      customerName,
      customerNameArray,
      showCoustomerNameList,
      grandTotal,
      userErrorMsg,
      enableSaveBtn,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1}} edges={['bottom', 'left', 'right']}>
        {/* HEADER SECTION */}
        <View style={styles.headerContainer}>
          <Text style={styles.headderText} numberOfLines={1}>
            Purchase Section
          </Text>

          <Icon
            name="logout"
            type="material"
            size={25}
            color="#fff"
            onPress={() => this.onLogout()}
            style={{marginRight: 0}}
          />
        </View>
        <ScrollView
          style={styles.container}
          ref={scrollView => (this.scrollView = scrollView)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1}}>
            <View style={{margin: 5, flex: 1}}>
              <Text style={{color: '#000', fontWeight: 'bold', fontSize: 16}}>
                Customer Name <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                placeholderTextColor={'rgba(0,0,0,0.4)'}
                style={[styles.input, {backgroundColor: '#fff'}]}
                placeholder="Customer name"
                value={customerName}
                onChangeText={text => this.searchCoustomerName(text)}
              />

              {showCoustomerNameList && customerNameArray.length > 0 ? (
                <Text style={{color: 'red'}}>Select a customer</Text>
              ) : null}
              {userErrorMsg ? (
                <Text style={{color: 'red'}}>{this.state.userErrorMsg}</Text>
              ) : null}

              {showCoustomerNameList
                ? customerNameArray.map((item, index) => {
                    return (
                      <View key={index} style={{backgroundColor: '#fff'}}>
                        <Text
                          style={styles.item}
                          onPress={() =>
                            this.setState({
                              customerName: item,
                              showCoustomerNameList: false,
                            })
                          }>
                          {item}
                        </Text>
                      </View>
                    );
                  })
                : null}

              {this.ordersMap.order.map((value, index) => {
                return (
                  <PurchaseItem
                    key={index}
                    order={value}
                    index={index}
                    orderLength={this.ordersMap.order.length}
                    onAddMorePressed={i => {
                      this.onAddMorePressed(i);
                    }}
                    getTotalPrice={productAdded => {
                      let amount = 0;
                      for (let orders of this.ordersMap.order) {
                        amount = amount + orders?.price;
                      }
                      this.setState({
                        grandTotal: amount,
                        enableSaveBtn: productAdded,
                      });
                    }}
                  />
                );
              })}

              <Text style={styles.grandTotal}>Grand Total : {grandTotal}</Text>
            </View>
            <Button
              disabled={
                grandTotal === 0 ||
                !customerName ||
                enableSaveBtn ||
                showCoustomerNameList
              }
              title={'Submit'}
              onPress={() => {
                this.props.navigation.navigate('SubmitedPage', {
                  customerName: customerName,
                  amount: grandTotal,
                });
              }}
              buttonStyle={{backgroundColor: 'green'}}
              containerStyle={{width: '100%', alignSelf: 'center'}}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
