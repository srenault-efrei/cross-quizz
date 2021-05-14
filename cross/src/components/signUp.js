import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
} from 'react-native';

import styles from '../../assets/styles/global'


import { gql, useMutation } from '@apollo/client';

const CREATEUSER = gql`
mutation createUser($name: String!, $email: String!, $password: String!) {
    signUp (name: $name, email: $email, password: $password) {
      token
      user {
        uuid
        name
        email
      }
    }
  }
`
const signUp = (props) => {

    const [name, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [createUser] = useMutation(CREATEUSER)
    const [errorMessage, setMessageError] = useState("")


    const apiCreateUser = () => {

        createUser({ variables: { name, email, password } })
            .then((response) => {
                props.navigation.navigate("SignIn")
            }
            ).catch((err) => {
                if (err.message.includes("duplicate key")) {
                    setMessageError(`${email} is not available `)
                } else {
                    setMessageError(err.message)
                }
            })
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Sign Up</Text>
            </View>
            <View style={styles.loginView}>
                <View style={styles.inputView}>
                    <TextInput
                        autoCapitalize='none'
                        style={styles.input}
                        placeholder="Nom"
                        onChangeText={name => setLastname(name)}
                    />
                    <TextInput

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
                        <Text style={styles.textButton} onPress={() => apiCreateUser()}>S'inscrire</Text>
                    </View>
                </View>
                <Text style={styles.error}>{errorMessage}</Text>
            </View>
            <View style={styles.bottomView}>
                <Text onPress={() => props.navigation.navigate('SignIn')} >Déjà inscrit ? Clique ici !</Text>
            </View>
        </SafeAreaView >
    );

}


export default signUp