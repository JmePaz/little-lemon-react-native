import { View, Text, StyleSheet, Pressable, Image, StatusBar,ScrollView, TextInput } from "react-native";
import logo from '../images/Logo.png'
import profilePic  from  '../images/Profile.png'

export default function Profile() {
    return (
        <View style={profileStyle.container}>
           <View style={profileStyle.headerBox}>
                <Pressable>
                    <Text>Back</Text>
                </Pressable>
                <Image source={logo} accessibilityLabel="Logo">
                </Image>
                <View>
                    <Text>JD</Text>
                </View>

           </View>
           <View style={profileStyle.InfoBox}> 
                <ScrollView style={{padding: 5, paddingHorizontal: 10}}>
                    <Text style={profileStyle.categoryText}>Personal Information</Text>
                    <View>
                        <Text style={{marginBottom: 4}}>Avatar</Text>
                        <View style={profileStyle.AvatarBox}>
                            <Image source={profilePic} accessibilityLabel="default picture" style={profileStyle.imgProfile}></Image>
                            <Pressable style={profileStyle.button2}>
                                <Text style={profileStyle.button2Text}>Change</Text>
                            </Pressable>
                            <Pressable style={{...profileStyle.button2, backgroundColor:'white', borderWidth: 1, borderColor: '#495850'}}>
                                <Text style={{color: '#495850'}}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                    <TextInputBox subject={"First name"} value={"Tilly"} onChangeText={(text)=>{}}></TextInputBox>
                    <TextInputBox subject={"Last name"} value={"Doe"} onChangeText={(text)=>{}}></TextInputBox>
                    <TextInputBox subject={"Email"} value={"tillydoe@example.com"} onChangeText={(text)=>{}}></TextInputBox>
                    <TextInputBox subject={"Phone number"} value={"(217) 555-0113"} onChangeText={(text)=>{}}></TextInputBox>
                    <Text style={profileStyle.categoryText}>Email notifications</Text>
                </ScrollView>
           </View>
           <View style={profileStyle.ControlBox}>
              <Pressable style={profileStyle.Button1}>
                    <Text style={profileStyle.Button1Text}>Log Out</Text>
              </Pressable>
           </View>
        </View>
    );

}

const TextInputBox = ({subject, value, onChangeText})=>{
    return (<View style={{marginVertical: 10}}>
        <Text style={{marginBottom: 4}}>{subject}</Text>
        <TextInput style={formStyle.inputText} value={value} onChangeText={onChangeText}></TextInput>
    </View>)
}

const formStyle = StyleSheet.create(
    {
        inputText:{
            borderWidth: 1,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 9
        }
    }
)

const profileStyle = StyleSheet.create(
    {
        imgProfile:{
            width: 75,
            height: 75,
        },
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