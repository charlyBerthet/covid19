import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { DynamicStyleSheet, DynamicValue, useDynamicStyleSheet } from 'react-native-dark-mode'
import Theme from '../core/Theme'

export interface Props {
  title: string
}

const Component = (props: Props) => {
  const styles = useDynamicStyleSheet(dynamicStyles)

  return (
    <Text style={ styles.container }>
      { props.title }
    </Text>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    fontSize: 30,
    fontWeight: '900',
    color: Theme.Text.Body,
    marginHorizontal: 15,
    marginTop: 30,
  },
});

export default Component;
