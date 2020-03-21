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
import Theme from '../../../core/Theme'

export interface Props {
  value: string
  label: string
}

const Component = (props: Props) => {
  const styles = useDynamicStyleSheet(dynamicStyles)

  return (
    <View style={ styles.container }>
      <Text style={ styles.value }>
        { props.value }
      </Text>
      <Text style={ styles.label }>
        { props.label }
      </Text>
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 25,
    fontWeight: '900',
    color: Theme.Text.Body
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: Theme.Text.Body,
    marginTop: -5
  }
});

export default Component;
