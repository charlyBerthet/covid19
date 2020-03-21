import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { NavigationProp } from '@react-navigation/native'
import { DynamicStyleSheet, DynamicValue, useDynamicStyleSheet } from 'react-native-dark-mode'
import Icon from 'react-native-vector-icons/FontAwesome5';

import LocalStorageService from '../../services/LocalStoreService'
import Theme from '../../core/Theme'
import Title from '../../components/Title'
import Button from '../../components/Button'
import OneStatistic from './components/OneStatistic'
import { exampleTemplate, DeclarationElementType, DeclarationElement } from '../Declaration/Template'
import StatsService from '../../services/StatsService'

export interface Props {
  navigation?: NavigationProp<any, any>
}

const addZero = (num: number) => num < 10 ? "0" + num : num + ""

const Component = (props: Props) => {
  const styles = useDynamicStyleSheet(dynamicStyles)
  const [declarations, setDeclarations] = useState<DeclarationElement[][]>([])
  const [stats, setStats] = useState<any>()
  const [hasLoadStatsError, setHasLoadStatsError] = useState(false)

  const getValue = (id: string, declaration: DeclarationElement[]) => {
    let val;
    declaration.forEach(elem => elem.id === id ? val = elem.value : null)
    return val
  }
  const getSignedOff = (declaration: DeclarationElement[]) => {
    return getValue('date_signedoff', declaration)
  }

  const sortDeclarations = (a: DeclarationElement[], b: DeclarationElement[]) => {
    const signedOffDateA = getSignedOff(a)
    const signedOffDateB = getSignedOff(b)
    if (signedOffDateA) {
      if (signedOffDateB) {
        return signedOffDateA < signedOffDateB ? 1 : -1
      }
    }

    if (signedOffDateA) return -1
    if (signedOffDateB) return 1
    return 0
  }

  useEffect(() => {
    LocalStorageService.get('declarations').then(declas => {
      declas = declas || []
      declas.sort(sortDeclarations)
      setDeclarations([...declas])
    })

    try {
      StatsService.getStats().then(setStats).catch(e => {
        console.log(e)
        setHasLoadStatsError(true)
      })
    }catch(e) {
      console.log(e)
      setHasLoadStatsError(true)
    }
  }, [])

  useEffect(() => {
    const sub = LocalStorageService.onChange('declarations', declas => {
      declas = declas || []
      declas.sort(sortDeclarations)
      setDeclarations([...declas])
    })
    return () => {
      sub.unsubscribe()
    }
  })

  return (
    <SafeAreaView style={ styles.container }>
      <Title title="COVID-19 🇫🇷" />
      <View style={ styles.subcontainer }>
        <Text style={ styles.subtitle }>
          Gestion des attestations de déplacement dérogatoire
        </Text>

        {
          hasLoadStatsError ? 
            <View style={{ height: 20 }}/>
          : (
            !stats ? (
              <ActivityIndicator style={ styles.statisticContainer } size="large"/>
            ) : (
              <View style={ styles.statisticContainer }>
                <OneStatistic 
                  label="Infectés"
                  value={ stats.infections }
                />
                <OneStatistic 
                  label="Guéris"
                  value={ stats.recovers }
                />
                <OneStatistic 
                  label="Morts"
                  value={ stats.deaths }
                />
              </View>
            )
          )
        }

        <View style={ styles.messageContainer }>
          <Text style={ styles.messageIcon }>⚠️</Text>
          <Text style={ styles.messageTxt }>Evitez au maximum vos contacts.</Text>
        </View>

        <View style={ styles.sectionTitleContainer }>
          <Text style={ styles.sectionTitleTxt }>Vos déclarations</Text>
          <Button title="Nouvelle" icon="plus" onPress={() => {
            props.navigation?.navigate('Declaration', {})
          }}/>
        </View>

        {
          declarations && declarations.length ? (
            <View style={ {flex: 1} }>
            <ScrollView style={ styles.scrollview }>
              {declarations.map((decla, idx) => {
                let isPassed = true
                const signedOffDate = getSignedOff(decla)
                let signedOffDateStr = "(sans date)"
                if (signedOffDate) {
                  const now = new Date()
                  now.setHours(0)
                  now.setMinutes(0)
                  now.setSeconds(0)
                  now.setMilliseconds(0)
                  if (signedOffDate > now.getTime()) {
                    isPassed = false
                  }
                  const date = new Date(signedOffDate)
                  signedOffDateStr = addZero(date.getDate()) + "/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear() + " à " + addZero(date.getHours()) + "h" + addZero(date.getMinutes())
                }
                return (
                  <View key={idx + '-container'}>
                    {
                      [
                        idx !== 0 ? (
                          <View style={ styles.declarationDivider } key={idx + '-divider'}/>
                        ) : null,
                        <TouchableOpacity style={ styles.declaration } 
                          onPress={() => {
                            props.navigation?.navigate('Declaration', {declaration: decla})
                          }}
                          key={idx + '-btn'}
                        >
                          <Text style={ styles.declarationIcon }>{
                            isPassed 
                              ? "🕣" : "✅"
                          }</Text>
                          <View style={ styles.declarationValues }>
                            <Text style={ styles.declarationTitle }>{ signedOffDateStr }</Text>
                            <Text style={ styles.declarationName }>{ getValue('name', decla) || '(sans nom)' }</Text>
                          </View>
                          <Icon 
                            name="chevron-right"
                            color={ styles.declarationTitle.color }
                            style={{opacity: 0.5}}
                            size={ 10 }
                          />
                        </TouchableOpacity>
                      ]
                    }
                  </View>
                )
              })}
            </ScrollView>
            </View>
          ) : (
            <Text style={ styles.declarationEmptyTxt }>Aucune déclaration pour le moment, tappez sur le bouton "Nouvelle" pour créer votre première déclaration.</Text>
          )
        }
      </View>
    </SafeAreaView>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    flex: 1,
    backgroundColor: Theme.Background.Body
  },
  subcontainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollview: {
    paddingTop: 15,
  },
  subtitle: {
    color: Theme.Text.Body,
    opacity: 0.5,
    fontSize: 14,
    fontWeight: '500',
  },

  statisticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 35,
  },

  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "#FFF0D3",
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  messageIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  messageTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.Black
  },

  sectionTitleContainer: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleTxt: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.Text.Body
  },

  declarationEmptyTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.Text.Body,
    marginTop: 15,
    opacity: 0.5
  },

  declaration: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  declarationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  declarationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.Text.Body,
  },
  declarationName: {
    fontSize: 14,
    fontWeight: '400',
    color: Theme.Text.Body,
    opacity: 0.5
  },
  declarationValues: {
    flex: 1,
    paddingVertical: 10,
  },
  declarationDivider: {
    height: 1,
    backgroundColor: Theme.Border,
    opacity: 0.5,
    marginLeft: 40,
  }
});

export default Component;
