import React from 'react';
import { Header, Icon } from 'react-native-elements';
import styles from '../../assets/styles/global';

import AsyncStorage from '@react-native-async-storage/async-storage';

const myHeader = (props) => {

    const logout = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys()
            await AsyncStorage.multiRemove(keys)
        }
        catch (err) {
            console.log('error disconnect :', err);

        }
        props.navigation.navigate('SignIn')
    }

    return (
        <Header
            leftComponent={<Icon
                name='home'
                type='Entypo'
                color='#fff'

                onPress={() => props.navigation.navigate("Dashboard")}
            />}
            centerComponent={{ text: props.name, style: { color: 'white', fontSize: 30 } }}
            rightComponent={
                <Icon
                    name='logout'
                    type='material-community'
                    color='white'
                    onPress={() => { logout() }}
                />
            }
            containerStyle={styles.header}
        />
    )
}

export default myHeader;

