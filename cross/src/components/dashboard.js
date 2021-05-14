import React, { useEffect } from 'react'
import {
    SafeAreaView,
    View,
    Text,
} from 'react-native';

import styles from '../../assets/styles/global'

import AsyncStorage from '@react-native-async-storage/async-storage';

import MyHeader from './header';



const dashboard = (props) => {


    useEffect(() => {
        async function setDataStorage() {
            let data = await AsyncStorage.getItem('data')
            if (!data) {
                props.navigation.navigate("SignIn")
            } else {
            }
        }
        setDataStorage()
    }, [])

    return (
        <SafeAreaView style={styles.safeArea}>
            <MyHeader name="Dashboard" navigation={props.navigation}>
            </MyHeader>
            <View style={{ justifyContent: "center", alignItems: "center", paddingLeft: "20%", paddingRight: "20%", flex: 1 }}>
                <View style={styles.buttonQuizz}>
                    <Text style={styles.textButton} onPress={() => props.navigation.navigate('Quizz')}>Commencer le Quizz</Text>
                </View>
            </View>
        </SafeAreaView >


    );

}


export default dashboard