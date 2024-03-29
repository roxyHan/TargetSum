import React from 'react';
import PropTypes from 'prop-types';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = 'PLAYING';
  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        (prevState) => {
          return {remainingSeconds: prevState.remainingSeconds - 1};
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  componentDidUnMount() {
    clearInterval(this.intervalId);
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((prevState) => {
      return {selectedIds: [...prevState.selectedIds, numberIndex]};
    });
  };

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }
  // Function to determine the status of the game: PLAYING, WON, LOST
  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    } else if (sumSelected === this.target) {
      return 'WON';
    } else {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Find the right sum for the target number displayed below
        </Text>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.boxDisplay}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameStatus !== 'PLAYING' && (
          <TouchableOpacity
            style={styles.replay}
            onPress={this.props.onPlayAgain}>
            <Text style={styles.playText}> Play Again </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.chrono}> Timer: {this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 30,
    borderWidth: 2,
  },

  header: {
    fontSize: 20,
    fontWeight: '800',
    flexWrap: 'wrap',
    textAlign: 'center',
  },

  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    marginHorizontal: 50,
    marginVertical: 20,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 15,
  },

  boxDisplay: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  boxes: {
    width: 50,
    backgroundColor: 'gray',
    fontSize: 35,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 3,
    marginHorizontal: 15,
    marginVertical: 25,
    textAlign: 'center',
  },

  replay: {
    backgroundColor: 'silver',
    width: 150,
    height: 45,
    alignSelf: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
  },

  playText: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },

  chrono: {
    fontSize: 20,
    textAlign: 'left',
  },

  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },

  STATUS_WON: {
    backgroundColor: 'green',
  },

  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
