import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';

const Stack = createNativeStackNavigator()
export default function App() {
  const [isUserSigned, setUserSigned] = useState(false)

  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName=''>
        <Stack.Screen name="OnBoarding" component={<Onboarding/>}/>
        <Stack.Screen name="Profile" component={<Profile/>}/>
        <Stack.Screen name="Home" component={<Home/>}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillContainer:{
    flex: 1
  }
});
