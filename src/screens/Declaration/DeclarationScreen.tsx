import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { NavigationProp } from '@react-navigation/native'
import { DynamicStyleSheet, DynamicValue, useDynamicStyleSheet } from 'react-native-dark-mode'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CheckBox from '@react-native-community/checkbox'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ViewShot from "react-native-view-shot"
import Share from 'react-native-share'

import LocalStorageService from '../../services/LocalStoreService'
import BackButton from '../../components/BackButton'
import Theme from '../../core/Theme'
import Title from '../../components/Title'
import Button from '../../components/Button'

import { exampleTemplate, DeclarationElementType, DeclarationElement } from './Template'

export interface Props {
  navigation?: NavigationProp<any, any>
  route?: any
}

const Component = (props: Props) => {
  const styles = useDynamicStyleSheet(dynamicStyles)
  const [declaration, setDeclaration] = useState<DeclarationElement[]>([...exampleTemplate.map(elem => ({...elem}))])
  const [isNew, setIsNew] = useState(true)
  const declarationView = useRef(null);
  const [signedAt, setSignedAt] = useState(Date.now)

  const form: any = {}
  declaration.forEach((elem: DeclarationElement) => {
    if(elem.id) {
      if (typeof elem.value == 'undefined'){
        if (elem.id === 'date_signedoff'){
          const now = new Date(signedAt)
          elem.value = {
            date: now.getDate() + "",
            month: now.getMonth() + 1 + "",
            year: now.getFullYear() + ""
          }
        } else {
          elem.value = ""
        }
      }
      form[elem.id!] = elem
    }
  })

  const signedBy = (form['name'] ? form['name'].value :  "") || "(sans nom)"

  useEffect(() => {
    if (props.route?.params?.declaration) {
      const newDeclaration = [...(props.route?.params?.declaration as DeclarationElement[]).map(elem => ({...elem}))].map(elem => {
        if (elem.id === 'date_signedoff'){
          const date = new Date(elem.value)
          setSignedAt(elem.value)
          elem.value = {
            date: date.getDate() + "",
            month: date.getMonth() + 1 + "",
            year: date.getFullYear() + ""
          }
        }
        return elem
      })
      setDeclaration(newDeclaration)
      setIsNew(false)
    }
  }, [])
  // console.log(form.date_signedoff)

  // if (!form['date_signedoff']) {
  //   const now = new Date()
  //   form['date_signedoff'] = {
  //     date: now.getDate() + "",
  //     month: now.getMonth() + 1 + "",
  //     year: now.getFullYear() + ""
  //   }
  // }

  const getDate = (formId: string) => {
    // console.log(form[formId])
    if (form[formId]) {
      return form[formId].value
    }
    return {
      date: "",
      month: "",
      year: ""
    }
  }

  const setDate = (formId: string, value: string, place: "date"|"month"|"year") => {
    const date = form[formId].value || {
      date: "",
      month: "",
      year: ""
    }
    date[place] = value
    updateElem(formId, date)
    // setForm({
    //   ...form,
    //   [formId]: date
    // },)
  }

  const updateElem = (id: string, value: any) => {
    const newDeclaration = [...declaration]
    newDeclaration.forEach((elem: DeclarationElement) => {
      if (elem.id === id) {
        elem.value = value
      }
    })
    setDeclaration(newDeclaration)
  }

  return (
    <SafeAreaView style={ styles.container }>
      <BackButton navigation={ props.navigation } />
      {
        isNew ? null : (
          <TouchableOpacity style={ styles.deleteBtn } onPress={() => {
            Alert.alert("Supprimer", "Êtes-vous sûr ?", [{
              text: 'Oui, supprimer',
              onPress: () => {
                LocalStorageService.get('declarations').then((declarations: DeclarationElement[][]) => {
                  const newDeclarations = declarations.filter(decla => {
                    const isSame = decla.filter(elem => elem.id === 'date_signedoff' && elem.value === signedAt)
                    return !isSame.length
                  })
                  LocalStorageService.save('declarations', newDeclarations)
                  props.navigation?.goBack()
                })
              },
              style: 'destructive'
            }, {text: 'Annuler'}])
          }}>
            <Text style={ styles.deleteTxt }>Supprimer</Text>
          </TouchableOpacity>
        )
      }
      <Title title={ isNew ? "Nouvelle Déclaration" : "Déclaration" } />
      {
        isNew ? null : (
          <Text style={ styles.notEditable }>Cette déclaration a été signée et ne peut plus être modifiée.</Text>
        )
      }

      <KeyboardAwareScrollView 
        // resetScrollToCoords={{ x: 0, y: 0 }}
        // contentContainerStyle={styles.container}
        scrollEnabled={true}
        style={ styles.scrollview }>
        <ViewShot style={ styles.subContainer } ref={ declarationView }>
          {
            declaration.map((elem, idx) => {
              return (
                <View key={ idx }>{
                  elem.type === DeclarationElementType.Title ? (
                      <Text style={ styles.title } >{ elem.text }</Text>
                    )
                  : elem.type === DeclarationElementType.Subtitle ? (
                    <Text style={ styles.subtitle } >{ elem.text }</Text>
                  )
                  : elem.type === DeclarationElementType.EmptySpace ? (
                    <Text style={ styles.emptySpace } />
                  )
                  : elem.type === DeclarationElementType.Body ? (
                    <Text style={ styles.body } >{ elem.text }</Text>
                  )
                  : elem.type === DeclarationElementType.TextInput ? (
                    <View style={ styles.textInputWrapper }>
                      <Text style={ styles.textInputTxt } >{ elem.text }</Text>
                      <TextInput
                        editable={ isNew }
                        style={ styles.textInput }
                        placeholder={ elem.placeholder }
                        placeholderTextColor={ styles.textInputPlaceholder.color }
                        value={ form[elem.id!].value }
                        onChangeText={ txt => updateElem(elem.id!, txt) }
                      />
                    </View>
                  )
                  : elem.type === DeclarationElementType.InputDate ? (
                    <View style={ [styles.textInputWrapper, styles.textInputWrapperDate] }>
                      <Text style={ [styles.textInputTxt, {marginRight: 10}] } >{ elem.text }</Text>
                      <TextInput
                        editable={ isNew && (elem.disabled ? false : true) }
                        style={ [styles.textInput, styles.textInputDate] }
                        placeholder={ "JJ" }
                        keyboardType="numeric"
                        placeholderTextColor={ styles.textInputPlaceholder.color }
                        value={ getDate(elem.id!).date }
                        onChangeText={ txt => setDate(elem.id!, txt, 'date') }
                      />
                      <Text style={ [styles.textInputTxt, {marginHorizontal: 4}] } >/</Text>
                      <TextInput
                        editable={ isNew && (elem.disabled ? false : true) }
                        style={ [styles.textInput, styles.textInputDate] }
                        placeholder={ "MM" }
                        keyboardType="numeric"
                        placeholderTextColor={ styles.textInputPlaceholder.color }
                        value={ getDate(elem.id!).month }
                        onChangeText={ txt => setDate(elem.id!, txt, 'month') }
                      />
                      <Text style={ [styles.textInputTxt, {marginHorizontal: 4}] } >/</Text>
                      <TextInput
                        editable={ isNew && (elem.disabled ? false : true) }
                        style={ [styles.textInput, styles.textInputDate, {width: 70}] }
                        placeholder={ "AAAA" }
                        keyboardType="numeric"
                        placeholderTextColor={ styles.textInputPlaceholder.color }
                        value={ getDate(elem.id!).year }
                        onChangeText={ txt => setDate(elem.id!, txt, 'year') }
                      />
                    </View>
                  )
                  : elem.type === DeclarationElementType.TextInputMultiline ? (
                    <View style={ styles.textInputWrapper }>
                      <Text style={ styles.textInputTxt } >{ elem.text }</Text>
                      <TextInput
                        editable={ isNew }
                        multiline
                        style={ [styles.textInput, {height: 100}] }
                        placeholder={ elem.placeholder }
                        placeholderTextColor={ styles.textInputPlaceholder.color }
                        value={ form[elem.id!].value }
                        onChangeText={ txt => updateElem(elem.id!, txt) }
                      />
                    </View>
                  )
                  : elem.type === DeclarationElementType.Checkbox ? (
                    <TouchableOpacity disabled={ !isNew } style={ styles.checkboxWrapper } onPress={() => {
                      // const newForm = {...form}
                      // for (var elemId in form) {
                      //   for (var k in declaration) {
                      //     if (elemId !== elem.id && elemId === declaration[k].id && declaration[k].name === elem.name) {
                      //       newForm[elemId] = false
                      //     }
                      //   }
                      // }
                      // newForm[elem.id!] = !newForm[elem.id!]
                      // setForm(newForm)
                      for (var elemId in form) {
                        for (var k in declaration) {
                          if (elemId !== elem.id && elemId === declaration[k].id && declaration[k].name === elem.name) {
                            updateElem(elemId, false)
                          }
                        }
                      }
                      updateElem(elem.id!, !form[elem.id!].value)
                    }}>
                      <CheckBox
                        style={ [styles.checkbox, (
                          form[elem.id!].value ? styles.checkboxValid : null
                        )] }
                        value={ form[elem.id!].value || false }
                      >
                        {
                          form[elem.id!].value ? (
                            <Icon 
                              name="check"
                              color={ Theme.White }
                              size={ 20 }
                            />
                          ) : null
                        }
                      </CheckBox>
                      <Text style={ [styles.textInputTxt, {flex: 1}] } >{ elem.text }</Text>
                    </TouchableOpacity>
                  )
                  : null
                }</View>
              )
            })
          }

          {
            isNew ? null : (
              <Text style={ [styles.textInputTxt, {flex: 1}] } >{ "Signé par " + signedBy + ""}</Text>
            )
          }
        </ViewShot>
      </KeyboardAwareScrollView>
      <View>
        <Button 
          style={ styles.button }
          title={ isNew ? "Signer" : "Partager" }
          icon={ isNew ? "check" : "share" }
          onPress={() => {
            if (isNew) {
              let isValid = true
              const finalDeclaration = [...declaration].map(elem => {
                if (elem.id === 'date_signedoff') {
                  elem.value = Date.now()
                } else if (elem.id === 'name' && !elem.value) {
                  isValid = false
                }
                return elem
              })
              if (!isValid) {
                return
              }
              LocalStorageService.push('declarations', finalDeclaration)
              props.navigation?.goBack()
            } else {
              if (declarationView && declarationView.current) {
                const viewShot: any = declarationView.current
                viewShot.capture().then((uri: any) => {
                  Share.open({
                    url: uri
                  }).then(() => {
                    Alert.alert("Fait ✅", "", [{
                      text: "Continuer"
                    }])
                  })
                })
              }
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    flex: 1,
    backgroundColor: Theme.Background.Body
  },
  scrollview: {
    // paddingHorizontal: 15,
  },
  subContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: Theme.Background.Body,
    paddingHorizontal: 15,
    paddingVertical: 20
  },

  title: {
    color: Theme.Text.Body,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  subtitle: {
    color: Theme.Text.Body,
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 5,
  },
  emptySpace: {
    height: 20,
  },
  body: {
    color: Theme.Text.Body,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  textInputWrapper: {
    marginBottom: 15,
  },
  textInputWrapperDate: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputTxt: {
    color: Theme.Text.Body,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  textInput: {
    color: Theme.Text.Body,
    fontSize: 16,
    fontWeight: '500',
    borderColor: Theme.Border,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  textInputDate: {
    paddingHorizontal: 0,
    width: 40,
    textAlign: 'center',
  },
  textInputPlaceholder: {
    color: Theme.Text.Placeholder
  },

  checkboxWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius: 4,
    marginTop: 2,
    borderColor: Theme.Border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxValid: {
    backgroundColor: Theme.Primary,
    borderWidth: 0
  },
  button: {
    alignSelf: 'center',
    paddingVertical: 13,
    paddingHorizontal: 45,
    marginVertical: 15,
  },

  deleteBtn: {
    marginBottom: -25,
    alignSelf: 'flex-end',
    marginRight: 5,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  deleteTxt: {
    color: 'red',
    fontSize: 12,
    fontWeight: '500'
  },

  notEditable: {
    fontSize: 12,
    fontWeight: '500',
    color: Theme.Text.Body,
    opacity: 0.5,
    marginHorizontal: 15,
  }

});

export default Component;
