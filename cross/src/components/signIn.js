import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,

} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../../assets/styles/global';

import { gql, useMutation } from '@apollo/client';


const LOGIN = gql`

mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password){
        token
        user{
            uuid,
            name,
            email
        }
    }
  }
`

const signIn = (props) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setMessageError] = useState("")
    const [login] = useMutation(LOGIN)

    const _storeData = async (data) => {
        try {
            await AsyncStorage.setItem('data', JSON.stringify(data));
        } catch (error) {
            console.log('Local storage data Error : ', error);
        }
    }

    const apiLogin = () => {
        login({ variables: { email, password } })
            .then((response) => {
                _storeData(response.data.signIn)
                props.navigation.navigate('Dashboard')
            }
            ).catch((err) => {
                setMessageError(err.message)
            })
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Cross Quizz</Text>
            </View>
            <View style={styles.loginView}>
                <View style={styles.inputView}>
                    <TextInput
                        name="email"
                        autoCapitalize='none'
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={email => setEmail(email)}
                    />
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder="Mot de passe"
                        onChangeText={password => setPassword(password)}
                    />
                    <View style={styles.button}>
                        <Text style={styles.textButton} onPress={() => apiLogin()}>Connexion</Text>
                    </View>
                </View>
                <Text style={styles.error}>{errorMessage}</Text>
            </View>
            <View style={styles.bottomView}>
                <Text onPress={() => props.navigation.navigate('SignUp')}>Pas encore inscrit ? Clique ici !</Text>
            </View>
        </SafeAreaView>
    );

}
export default signIn