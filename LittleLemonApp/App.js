import { ActivityIndicator, StyleSheet,View } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator()
export default function App() {
  const [isUserSigned, setUserSigned] = useState(null)

  async function getData ()  {

    try {
      const value = JSON.parse(await AsyncStorage.getItem('isUserSigned'));
      if (value !== null) {
        // value previously stored
        setUserSigned(value)
      }
      else{
        setUserSigned(false)
      }
    } catch (e) {
      // error reading value
      console.log(`Error ${e}`)
    }
  };

  useEffect(
    ()=>{
      getData()
    },[])

  if(isUserSigned===null){
    return (
    <View styles={{flex:1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#00ff00"></ActivityIndicator>
    </View>)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isUserSigned?"Profile":"OnBoarding"} screenOptions={{headerShown: false}} >
        <Stack.Screen name="OnBoarding" component={Onboarding}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Home" component={Home}/>
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
