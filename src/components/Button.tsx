import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import { DynamicStyleSheet, DynamicValue, useDynamicStyleSheet } from 'react-native-dark-mode'
import Icon from 'react-native-vector-icons/FontAwesome5';

import Theme from '../core/Theme'

export interface Props {
  title: string
  icon: string
  onPress: () => void
  style?: any
}

const Component = (props: Props) => {
  const styles = useDynamicStyleSheet(dynamicStyles)

  return (
    <TouchableOpacity style={ [styles.container, props.style] } onPress={ props.onPress }>
      <Text style={ styles.text }>
        { props.title }
      </Text>
      <Icon 
        name={ props.icon }
        size={ 17 }
        color={ styles.icon.color }
      />
    </TouchableOpacity>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Primary,
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.White,
    marginRight: 10,
  },
  icon: {
    color: Theme.White
  }
});

export default Component;
