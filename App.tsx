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
import Navigator from './src/core/Navigator'
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const styles = useDynamicStyleSheet(dynamicStyles)

  useEffect(() => {
    // delay so layout has time to be charged
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={ styles.container }>
        <Navigator />
      </View>
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    flex: 1,
  },
});

export default App;
