import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


import SignIn from './src/components/signIn'
import SignUp from './src/components/signUp'
import Dashboard from './src/components/dashboard'
import Quizz from './src/components/quizz'
import End from './src/components/end'
const client = new ApolloClient({
  uri: 'http://localhost:4000/', // Fonctionne sur le simulateur pas sur le phone
  cache: new InMemoryCache()
});

const Drawer = createDrawerNavigator()
export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{ gestureEnabled: false }}>
          <Drawer.Screen name="SignUp" component={SignUp} />
          <Drawer.Screen name="SignIn" component={SignIn} />
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="Quizz" component={Quizz} />
          <Drawer.Screen name="End" component={End} />

        </Drawer.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );

}



