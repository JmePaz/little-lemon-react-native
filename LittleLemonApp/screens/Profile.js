import { View, Text, StyleSheet, Pressable, Image, StatusBar,ScrollView, TextInput, Alert } from "react-native";
import logo from '../images/Logo.png'
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from 'expo-image-picker'
import ProfilePicture from "../components/ProfilePicture";
import {transStateMap, dialogueConfirm} from '../components/Utility'

export default function Profile({navigation}) {
    function iterateObjects(obj, invokeAction){

        return Object.fromEntries(Object.entries(obj).map(
            ([k,v])=>{
                return invokeAction(k, v)
            }
        ))
    }

    const userData = {
        firstName: transStateMap(useState("")),
        lastName: transStateMap(useState("")),
        email: transStateMap(useState("")),
        phoneNo: transStateMap(useState(""))
    }
    const userPreferences = {
        orderStatuses: transStateMap(useState(false)),
        passwordChanges: transStateMap(useState(false)),
        specialOffer: transStateMap(useState(false)),
        newsLetter: transStateMap(useState(false))
    }

    const [profileImage, setProfileImage] = useState(null)

    let tempUserData = useRef({});
    let tempUserPreferences = useRef({});
    
    const StartFetch = async () => {
        try{
            //USER PICTURE
            const userPic = await AsyncStorage.getItem("profilePic")
            setProfileImage(userPic)

            //USER DATA & PREFENCES

            //fetch from local
            const data = await AsyncStorage.getItem("userData")
            const dataJSON = JSON.parse(data)


            //FOR USER DATA
            tempUserData.current = iterateObjects(dataJSON, (k,v)=>{
                if(k in userData){
                    userData[k].setValue(v)
                }
                return [k, v]
            })

            //fetch from local
            const dataPreferences = await AsyncStorage.getItem("userPreferences")
            if(dataPreferences!== null){
                const dataPreferencesJSON = JSON.parse(dataPreferences)
                
                //FOR USER PREFENCES
                tempUserPreferences.current = iterateObjects(dataPreferencesJSON, (k, v)=>{
                    if(k in userPreferences){
                        userPreferences[k].setValue(v)
                    }
                    return [k, v]
                })
            }
            else{
                tempUserPreferences.current = resetUserPrefences()
            }
            
            
        }
        catch(err){
            console.error('error',err)
        }
    }

    const SaveDataLocal = async ()=> {
        try{
            const userDataToSave = iterateObjects(userData, (k,v)=>{
                return [k, v.value]
            })
            tempUserData.current = userDataToSave
            
            await AsyncStorage.setItem("userData", JSON.stringify(userDataToSave))

            const userPreferencesToSave = iterateObjects(userPreferences, (k,v)=>{
                return [k, v.value]
            })
            tempUserPreferences.current = userPreferencesToSave
            await AsyncStorage.setItem("userPreferences", JSON.stringify(userPreferencesToSave))
            Alert.alert("Status", "Saved Data")
        }
        catch(err){
            console.log(err)
            Alert.alert("Status", "Failed to Saved Data")
        }
    }

    const DiscardChanges = ()=>{
        iterateObjects(tempUserData.current, (k,v)=>{
            if(k in userData){
                userData[k].setValue(v)
            }
            
            return [k, v]
        })
        iterateObjects(tempUserPreferences.current, (k,v)=>{
            if(k in userPreferences){
                userPreferences[k].setValue(v)
            }
            return [k, v]
        })
        

    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
          await AsyncStorage.setItem("profilePic", result.assets[0].uri)
        }
      };

    const logOut = async () => {
        await AsyncStorage.clear()
        navigation.navigate("OnBoarding")
    }

    const resetUserPrefences= ()=>{
        return iterateObjects(userPreferences, (k, v)=>{
            userPreferences[k].setValue(false)
            return [k, false]
        })
    }

    //start/initial method when the screen is focused
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', ()=>{        
            StartFetch()
        })
        return unsubscribe
    }, [navigation])


    
    const nameInitials = userData.firstName.value.charAt(0) + (userData.lastName.value===""?".":userData.lastName.value?.charAt(0))

    return (
        <View style={profileStyle.container}>
           <View style={profileStyle.headerBox}>
                <Pressable onPress={
                    ()=>{
                        navigation.navigate("Home")
                    }
                }>
                    <Ionicons name={"arrow-back"} size={32} color={"#495850"}></Ionicons>
                </Pressable>
                <Image source={logo} accessibilityLabel="Logo">
                </Image>
                <ProfilePicture source={{uri: profileImage}} width={50} height={50} defaultText={nameInitials}/>
           </View>
           <View style={profileStyle.InfoBox}> 
                <ScrollView style={{paddingVertical: 5, paddingHorizontal: 10, marginBottom: 10}}>
                    <Text style={profileStyle.categoryText}>Personal Information</Text>
                    <View>
                        <Text style={{marginBottom: 4}}>Avatar</Text>
                        <View style={profileStyle.AvatarBox}>
                            <ProfilePicture source={{uri: profileImage}} width={75} height={75} defaultText={nameInitials}/>
                            <Pressable style={profileStyle.button2} onPress={pickImage}>
                                <Text style={profileStyle.button2Text}>Change</Text>
                            </Pressable>
                            <Pressable style={{...profileStyle.button2, backgroundColor:'white', borderWidth: 1, borderColor: '#495850'}}
                                onPress={async ()=>{
                                    setProfileImage(null)
                                    await AsyncStorage.removeItem("profilePic")
                                    }}>
                                <Text style={{color: '#495850'}}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                    <TextInputBox subject={"First name"} value={userData.firstName.value} onChangeText={userData.firstName.setValue} keyboardType={"default"}></TextInputBox>
                    <TextInputBox subject={"Last name"} value={userData.lastName.value} onChangeText={userData.lastName.setValue} keyboardType={"default"}></TextInputBox>
                    <TextInputBox subject={"Email"} value={userData.email.value} onChangeText={userData.email.setValue} keyboardType={"email-address"}></TextInputBox>
                    <CustomTextInputBox subject={"Phone number"}>
                        <MaskedTextInput mask="(999) 999-9999" maxLength={"(999) 999-9999".length}  value={userData.phoneNo.value} onChangeText={userData.phoneNo.setValue}
                         keyboardType={"phone-pad"}style={formStyle.inputText} placeholder="Enter Phone number"></MaskedTextInput>
                    </CustomTextInputBox>
                    <Text style={profileStyle.categoryText}>Email notifications</Text>
                    <CheckBox text="Order statuses" isChecked={userPreferences.orderStatuses.value}  onChangeValue={(isChecked)=>userPreferences.orderStatuses.setValue(!userPreferences.orderStatuses.value)}/>
                    <CheckBox text="Password changes"  isChecked={userPreferences.passwordChanges.value} onChangeValue={(isChecked)=>userPreferences.passwordChanges.setValue(!userPreferences.passwordChanges.value)}/>
                    <CheckBox text="Special offers" isChecked={userPreferences.specialOffer.value} onChangeValue={(isChecked)=>userPreferences.specialOffer.setValue(!userPreferences.specialOffer.value)}/>
                    <CheckBox text="Newsletter" isChecked={userPreferences.newsLetter.value} onChangeValue={(isChecked)=>userPreferences.newsLetter.setValue(!userPreferences.newsLetter.value)}/> 
                </ScrollView>
                <View style={formStyle.updateControls}>
                        <Pressable style={{...profileStyle.button2, backgroundColor:'white', borderWidth: 1, borderColor: '#495850'}}
                           onPress={()=>dialogueConfirm(
                            "Changes", "Are you sure you want to discard changes?",
                            ()=>{DiscardChanges()}
                        )}>
                            <Text style={{color: '#495850'}}>Discard Changes</Text>
                        </Pressable>
                        <Pressable style={profileStyle.button2} onPress={()=>{
                            SaveDataLocal()
                        }}>
                            <Text style={profileStyle.button2Text}>Save Changes</Text>
                        </Pressable>
                    </View>
           </View>
           <View style={profileStyle.ControlBox}>
              <Pressable style={profileStyle.Button1} onPress={ ()=>
                    dialogueConfirm(
                        "Logout", "Are you sure you want to Logout?",
                        ()=>{logOut()}
                    )
                    }>
                    <Text style={profileStyle.Button1Text}>Log Out</Text>
              </Pressable>
           </View>
        </View>
    );

}

const TextInputBox = ({subject, value, onChangeText, keyboardType})=>{
    return (<View style={{marginVertical: 10}}>
        <Text style={{marginBottom: 4}}>{subject}</Text>
        <TextInput style={formStyle.inputText} value={value} onChangeText={onChangeText} placeholder={`Enter your ${subject}`}
        keyboardType={keyboardType}></TextInput>
    </View>)
}

const CustomTextInputBox = ({subject, children})=>{
    return (<View style={{marginVertical: 10}}>
        <Text style={{marginBottom: 4}}>{subject}</Text>
        {/* <ChildComponent/> */}
        {children}
    </View>)
}
const CheckBox = ({text, isChecked, onChangeValue})=>{
    return(<BouncyCheckbox style={{marginVertical: 7}} isChecked={isChecked} onPress={onChangeValue} text={text} textStyle={{textDecorationLine: "none"}} iconStyle={{borderRadius: 5}} innerIconStyle={{borderRadius: 5}}
    fillColor="#495850"  disableBuiltInState/>)
}

const formStyle = StyleSheet.create(
    {
        inputText:{
            borderWidth: 1,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 9
        },
        updateControls: {
            backgroundColor:'#f4ce14',
            paddingTop: 15,
            paddingBottom: 15,
            flexDirection: 'row',
            justifyContent: 'space-around'
        }
    }
)

const profileStyle = StyleSheet.create(
    {
       
        container: {flex: 1,
             marginTop: StatusBar.currentHeight,
            backgroundColor: 'white'},
      headerBox:{
        flex: 0.10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
      } ,
      InfoBox: {
        flex: 0.8,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        margin: 10
      },
      ControlBox: {
        flex: 0.1,
        marginHorizontal: 10
      },
      Button1:{
        padding: 10,
        backgroundColor: '#f4ce14',
        borderRadius:10,
        borderWidth: 1,
        borderColor: 'black'
      },
      Button1Text:{
        textAlign: 'center'
      },
      categoryText:{
        fontSize: 17,
        fontWeight: 'bold',
        marginVertical: 7
      },
      AvatarBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        alignItems: 'center'
      },
      button2:{
        backgroundColor: '#495850',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8
      },
      button2Text: {
        color: 'white'
      }
      
    }
)