
import { View, StyleSheet, Image,StatusBar, Text, TextInput, Pressable, Alert } from "react-native";
import logo from '../images/Logo.png'
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({navigation}){
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [allValid, setValidity] = useState(false)

    const validateFields = (firstName, email)=>{
        if(firstName==null || firstName.length<=1 || /\d/.test(firstName)){
            return false
        }
        if(email==null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ==false){
            return false
        }

        return true

    }

    useEffect(
        ()=>{
            setValidity(validateFields(firstName, email))
        },[firstName, email])

    

    const goToNext =  async ()=>{
        await AsyncStorage.setItem('isUserSigned', JSON.stringify(true))
        await AsyncStorage.setItem('userData', JSON.stringify({firstName: firstName, email: email}))
        navigation.navigate('Home')
    }

    return ( <View style={onboardStyle.container}>
        <View style={{flex: 0.125, 
            backgroundColor : '#dee3e9', justifyContent: 'center'}}>
            <Image source={logo} style={onboardStyle.imgHeader} resizeMethod="scale"  resizeMode="contain"></Image>
        </View>
        <View style={{flex: 0.8 , backgroundColor: '#cbd2d9'}}>
            <View style={{flex: 0.4, justifyContent: 'center'}}>
                <Text style={onboardStyle.bodyText}>Let us get to know you</Text>
            </View>
            <View style={{flex: 0.5, justifyContent: 'space-around'}}>
                <View>
                    <Text style={onboardStyle.bodyText}>First Name</Text>
                    <TextInput value={firstName} onChangeText={(text)=>{
                        if(/\d/.test(text)){
                            return
                        }
                        setFirstName(text)}} style={onboardStyle.textInput} keyboardType={"ascii-capable"}></TextInput>
                </View>
                <View>
                    <Text style={onboardStyle.bodyText}>Email</Text>
                    <TextInput value={email} onChangeText={
                        setEmail} style={onboardStyle.textInput} keyboardType={"email-address"}></TextInput>
                </View>
            </View>
        </View>
        <View style = {{flex: 0.2, justifyContent: 'center', alignItems: 'flex-end', marginHorizontal: 30}}>
            <Pressable disabled={!allValid}  style={onboardStyle.button} onPress={goToNext}>
                <Text style={onboardStyle.bodyText}>Next</Text>
            </Pressable>
        </View>
    </View>)
}



const onboardStyle = StyleSheet.create(
    {
        container: {
            flex: 1,
            marginTop: StatusBar.currentHeight,
            
        }
        ,
        imgHeader:{
            width: '100%',
            height: 70,
            paddingVertical: 8,
        },
        bodyText: {
            fontSize: 24,
            color: '#495E57',
            fontWeight:'500',
            textAlign: 'center',
        },
        textInput: {
            borderColor: '#495E57',
            borderWidth: 2,
            fontSize: 20,
            paddingHorizontal: 8,
            paddingVertical: 15,
            borderRadius: 10,
            marginHorizontal: 30
        },
        button : {
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: '#dee3e9',
            borderRadius: 10
        }
    }
)