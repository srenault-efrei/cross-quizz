import React, { useEffect } from 'react'
import {
    SafeAreaView,
    View,
    Text,
} from 'react-native';

import MyHeader from './header';

import styles from '../../assets/styles/global'


const end = (props) => {

    return (
        <SafeAreaView style={styles.safeArea}>
            <MyHeader name="Dashboard" navigation={props.navigation}>
            </MyHeader>
            <View style={{ justifyContent: "center", alignItems: "center", paddingLeft: "20%", paddingRight: "20%", flex: 1 }}>
                <View>
                    <Text>
                        {props.route.params.score ? `Bonne réponse, votre score est ${props.route.params.score} / 1` : `Mauvaise réponse votre score est 0/ 1`}
                    </Text>
                </View>
            </View>
        </SafeAreaView >


    );

}


export default end