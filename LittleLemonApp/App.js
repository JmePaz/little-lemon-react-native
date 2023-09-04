import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import Onboarding from './screens/Onboarding';


export default function App() {
  return (
    <Onboarding></Onboarding>
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
