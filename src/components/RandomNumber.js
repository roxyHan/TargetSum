import React from 'react';

import PropTypes from 'prop-types';

import {Text, TouchableOpacity, StyleSheet} from 'react-native';

class RandomNumber extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
  };
  handlePress = () => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onPress(this.props.id);
  };
  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.random, this.props.isdisabled && styles.disabled]}>
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  random: {
    backgroundColor: 'gray',
    width: 100,
    marginHorizontal: 25,
    borderRadius: 15,
    marginVertical: 35,
    fontSize: 35,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
});

export default RandomNumber;
