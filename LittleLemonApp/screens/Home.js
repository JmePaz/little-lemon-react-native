import { View, Text, StatusBar, StyleSheet, Image, Pressable} from "react-native";
import logo from '../images/Logo.png'
import ProfilePicture from "../components/ProfilePicture";
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import heroImg from '../images/HeroImage.png'
import Ionicons from '@expo/vector-icons/Ionicons'
import CategoryButton from "../components/CategoryBtn";
import { ScrollView } from "react-native";
import CardDish from "../components/CardDish";

export default function Home({navigation}) {
    const [nameInitials, setNameInitials] = useState("")
    const [profileImg, setProfileImg] = useState(null)

    const fetchProfile = async ()=>{
         await AsyncStorage.getItem("profilePic").then((value)=>setProfileImg(value))
         if(profileImg===null){
            //get initials
            await AsyncStorage.getItem("userData")
            .then((value)=>JSON.parse(value))
            .then((value)=>{
                const fName = value.firstName
                const LName = value.lastName==="" ? "." : value.lastName
                setNameInitials(fName?.charAt(0)+LName?.charAt(0))
            })
         }
    };

    //start/initial method when the screen is focused
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', ()=>{        
            fetchProfile()
        })
        return unsubscribe
    }, [navigation])


    return (
        <View style={{flex: 1,marginTop:StatusBar.currentHeight, backgroundColor: 'white'}}>
            <View style={homeStyle.headerBox}>
                <View style={{flex: 0.25}}/>
                <Image source={logo} accessibilityLabel="Logo"></Image>
                <Pressable onPress={()=>{navigation.navigate("Profile")}}>
                    <ProfilePicture source={{uri:profileImg}} width={50} height={50} defaultText={nameInitials}/>
                </Pressable>
           </View>
           <View style={{flex: 0.90, }}>
                <View style={homeStyle.heroBox}>
                    <Text style={homeStyle.headerText}>Little Lemon</Text>
                    <View style={{flexDirection: 'row', flex: 0.8}}>
                        <View style={{flex: 0.6, justifyContent: 'space-between'}}>
                            <Text style={homeStyle.bodyText}>Chicago</Text>
                            <Text style={[homeStyle.smallerBodyText, {lineHeight: 20}]}>We are family owned Mediterranean restaurant,
                                focused on traditional recipes served with a modern twist
                            </Text>
                        </View>
                        <View style={{flex: 0.4, justifyContent: 'flex-end'}}>
                            <Image source={heroImg}  style={{width: 140, height: '95%', borderRadius: 10}} accessibilityLabel="A hero Image" ></Image>
                        </View>
                    </View>
                    <View style={{flex: 0.2 , marginTop: 10}}>
                        <View style={{backgroundColor: 'white', padding: 10, alignSelf: 'flex-start', borderRadius: 40 }}>
                            <Ionicons name="md-search-sharp" color={"black"} size={20} >
                            </Ionicons>
                        </View>
                    </View>
                </View>
                <View style ={{ paddingHorizontal: 10, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc', flex: 0.14}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold',}}>Order for Delivery</Text>
                    <ScrollView horizontal={true} >
                        <CategoryButton text={"SeaFood"}></CategoryButton>
                        <CategoryButton text={"Pasta"}></CategoryButton>
                        <CategoryButton text={"Drinks"}></CategoryButton>
                        <CategoryButton text={"Pasta"}></CategoryButton>
                        <CategoryButton text={"Drinks"}></CategoryButton>
                        <CategoryButton text={"Pasta"}></CategoryButton>
                        <CategoryButton text={"Drinks"}></CategoryButton>
                    </ScrollView>
                </View>
                <View style={{flex: 0.46, marginHorizontal: 10, paddingVertical:5}}>
                    <ScrollView>
                        <CardDish title={"Greek Salad"} description={"Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients."} price={12.99}></CardDish>
                        <CardDish title={"Greek Salad"} description={"Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients."} price={12.99}></CardDish>
                        <CardDish title={"Greek Salad"} description={"Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients."} price={12.99}></CardDish>
                        <CardDish title={"Greek Salad"} description={"Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients."} price={12.99}></CardDish>
                        <CardDish title={"Greek Salad"} description={"Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients."} price={12.99}></CardDish>
                    </ScrollView>
                </View>
           </View>
           
        </View>
    );
}

const homeStyle = StyleSheet.create({
    headerBox:{
        flex: 0.10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
      },
    heroBox: {flex:0.40, 
        backgroundColor: 
        '#495850',
        paddingVertical: 8,
        paddingHorizontal: 10},
    headerText: {
        fontSize: 35,
        color: '#f4ce14',
        fontWeight: '500',
        letterSpacing: 5
    },
    bodyText:{
        color: 'white',
        fontSize: 24,
        letterSpacing: 2
    },
    smallerBodyText:{
        fontSize: 16,
        color: 'white',
    }
})