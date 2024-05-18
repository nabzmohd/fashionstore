import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {styles} from './styles';

export default class SubmitedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {customerName, amount} = this.props.route.params;
    return (
      <View style={{flex: 1}}>
        {/* HEADER SECTION */}
        <View style={styles.headerContainer}>
          <Text style={styles.headderText} numberOfLines={1}>
            Order Submitted
          </Text>
        </View>
        <View
          style={[
            styles.container,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Icon name={'verified'} type="Octicons" color={'#2a9d8f'} size={60} />
          <Text style={styles.text2}>Name :{customerName}</Text>
          <Text style={styles.text2}>Total Amount :{amount}</Text>
          <Text style={styles.text2}>Order Submited successfully</Text>
        </View>
      </View>
    );
  }
}
