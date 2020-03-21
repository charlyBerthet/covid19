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

import { NavigationProp } from '@react-navigation/native'
import { DynamicStyleSheet, DynamicValue, useDynamicStyleSheet } from 'react-native-dark-mode'
import Icon from 'react-native-vector-icons/FontAwesome5';

import Theme from '../core/Theme'

export interface Props {
  navigation?: NavigationProp<any, any>
}

const Component = (props: Props) => {
  const styles = useDynamicStyleSheet(dynamicStyles)

  return (
    <TouchableOpacity style={ styles.container } onPress={ () => {
      props.navigation?.goBack()
    } }>
      <Icon 
        name={ "chevron-left" }
        size={ 17 }
        color={ styles.icon.color }
      />
      <Text style={ styles.text }>
        Retour
      </Text>
    </TouchableOpacity>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    paddingLeft: 20,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: -20,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.Text.Body,
    marginLeft: 10,
  },
  icon: {
    color: Theme.Text.Body
  }
});

export default Component;
