import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {styles} from './styles';

export default class PurchaseItem extends Component {
  state = {
    productName: this.props.order.productName,
    productArray: [],
    quantity: this.props.order.quantity,
    price: this.props.order.price,
    showProductNameList: true,
    productErrorMsg: '',
  };

  productData = {
    Shirt: 1000,
    Jeans: 1500,
    Shoes: 2000,
    watch: 700,
    Boots: 1200,
    Vest: 500,
    Sunglasses: 1250,
  };

  serachProductName(text) {
    let {order} = this.props;
    order.productName = text;
    order.price = this.productData[text] ? this.productData[text] : 0;
    order.quantity = 1;
    order.errorMessage = '';

    let data = Object.keys(this.productData);
    const filteredData = data.filter(item =>
      item.toLowerCase().includes(text.toLowerCase()),
    );
    this.setState({
      productName: text,
      showProductNameList: true,
      price: this.productData[text],
      quantity: 1,
      productArray: filteredData,
      productErrorMsg: filteredData?.length === 0 ? 'Product not found' : '',
    });
  }

  increamentOrDecrementQntity(quantityType) {
    if (quantityType === 'decrement' && this.state.quantity === 1) return;
    let amout =
      quantityType === 'increment'
        ? this.state.price + this.productData[this.state.productName]
        : this.state.price - this.productData[this.state.productName];
    let qty =
      quantityType === 'increment'
        ? this.state.quantity + 1
        : this.state.quantity - 1;

    this.props.order.price = amout;
    this.props.order.quantity = qty;
    this.props.getTotalPrice(this.state.showProductNameList);
    this.setState({quantity: qty, price: amout});
  }

  render() {
    let {order, index, orderLength} = this.props;
    return (
      <View style={styles.productContainer}>
        <Text style={{color: '#000', fontWeight: 'bold', fontSize: 16}}>
          Product Name <Text style={{color: 'red'}}>*</Text>
        </Text>
        <TextInput
          placeholderTextColor={'rgba(0,0,0,0.4)'}
          style={styles.input}
          placeholder="Product Name"
          onChangeText={text => {
            this.serachProductName(text);
            this.props.getTotalPrice(true);
          }}
          value={this.state.productName}
        />

        {this.state.showProductNameList &&
        this.state.productArray.length > 0 ? (
          <Text style={{color: 'red'}}>select a product</Text>
        ) : null}
        {this.state.productErrorMsg || order?.errorMessage ? (
          <Text style={{color: 'red'}}>
            {this.state.productErrorMsg}{' '}
            {order?.errorMessage ? order.errorMessage : ''}
          </Text>
        ) : null}

        {this.state.showProductNameList
          ? this.state.productArray.map((item, index) => {
              return (
                <View key={index} style={{backgroundColor: '#fff'}}>
                  <Text
                    style={styles.item}
                    onPress={() => {
                      let amount = this.productData[item]
                        ? this.productData[item]
                        : 0;

                      order.productName = item;
                      order.price = amount;
                      order.quantity = 1;
                      this.setState({
                        productName: item,
                        showProductNameList: false,
                        price: amount,
                        quantity: 1,
                      });
                      this.props.getTotalPrice(false);
                    }}>
                    {item}
                  </Text>
                </View>
              );
            })
          : null}

        <View style={styles.sectionContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.text}>
              Price : {this.state.price ? this.state.price : 0}
            </Text>
          </View>

          <View style={styles.quantityContaine}>
            <Text style={styles.text}>Qty</Text>
            <Button
              raised
              disabled={this.state.showProductNameList}
              buttonStyle={{backgroundColor: '#78ad40'}}
              containerStyle={{width: 50, margin: 0, padding: 0}}
              titleStyle={{color: '#000', fontSize: 18}}
              title="-"
              onPress={() => this.increamentOrDecrementQntity('decrement')}
            />
            <Text style={{fontSize: 15, color: '#000'}}>
              {this.state.quantity}
            </Text>
            <Button
              raised
              disabled={this.state.showProductNameList}
              buttonStyle={{backgroundColor: '#78ad40'}}
              containerStyle={{width: 50}}
              titleStyle={{color: '#000', fontSize: 18}}
              title="+"
              onPress={() => this.increamentOrDecrementQntity('increment')}
            />
          </View>
        </View>

        {orderLength === index + 1 ? (
          <Button
            disabled={this.state.showProductNameList}
            icon={{
              name: 'plus',
              type: 'material-community',
              size: 15,
              color: 'white',
            }}
            title={'Add More'}
            onPress={() => {
              this.props.onAddMorePressed(index);
            }}
            buttonStyle={{backgroundColor: 'green'}}
            containerStyle={{
              width: 150,
              marginVertical: 10,
              alignSelf: 'center',
            }}
          />
        ) : null}
      </View>
    );
  }
}
