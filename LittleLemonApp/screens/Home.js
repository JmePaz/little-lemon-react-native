import { View, Text, StatusBar, StyleSheet, Image, Pressable, FlatList, ScrollView, ActivityIndicator, TextInput,  KeyboardAvoidingView} from "react-native";
import logo from '../images/Logo.png'
import ProfilePicture from "../components/ProfilePicture";
import {useRef,useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import heroImg from '../images/HeroImage.png'
import Ionicons from '@expo/vector-icons/Ionicons'
import CategoryButton from "../components/CategoryBtn";
import CardDish from "../components/CardDish";
import * as SQLite from 'expo-sqlite';
import { Platform } from "react-native";


export default function Home({navigation}) {
    const db = SQLite.openDatabase('little_lemon');

    const [nameInitials, setNameInitials] = useState("")
    const [profileImg, setProfileImg] = useState(null)
    const [menuData, setMenuData] = useState([])
    const [isLoadingMenu, setLoadingMenu] = useState([])
    const [statusCategories, setStatusCategories] = useState({
        "Starters":false,
        "Mains": false,
        "Desserts": false,
        "Drinks":false,
        "Special": false
    })
    const [searchText, setSearchText] = useState("")

    const fetchProfile = async ()=>{
         await AsyncStorage.getItem("profilePic").then((value)=>setProfileImg(value))
         if(profileImg===null){
            //get initials
            const initals = await AsyncStorage.getItem("userData")
            .then((value)=>JSON.parse(value))
            .then((value)=>{
                const fName = value.firstName
                const LName = value.lastName==="" ? "." : value.lastName
                return fName?.charAt(0)+LName?.charAt(0)
            })

            setNameInitials(initals)
         }
    };


    const readMenuItems = async (query = "SELECT * FROM MenuItem")=>{

       return new Promise((resolve, reject)=>{
            db.transaction((tx)=>{
                tx.executeSql(
                    query, [],
                    (_, {rows: {_array}})=>{
                        resolve(_array)
                    },
                    (_, error)=>{
                        reject(error)
                    }

                )
            })
        })
       
    }  

    const saveMenuItems =async (menuDataItems)=>{
        await db.transaction(
            (tran)=>{
                menuDataItems.forEach(
                    (menuData)=>{
                        tran.executeSql("INSERT INTO MenuItem (name, price, description, category,image) VALUES (?, ?, ?, ?,?)", 
                        [menuData.name, menuData.price,menuData.description, menuData.category,menuData.image])
                    }
                )
               
            }
        )
    }

    const init = async ()=>{
        setLoadingMenu(true)
        await db.transaction(
            (tran)=>{
                tran.executeSql("CREATE TABLE IF NOT EXISTS MenuItem (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL,image TEXT NOT NULL)")
            }
        )

        await fetchMenuData()
        setLoadingMenu(false)
    }

    const fetchMenuData = async ()=>{
        const currentMenuData = await readMenuItems()

        if(!currentMenuData || currentMenuData.length==0){
            console.log("Fetched from network")
            menuFetchedData = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json")
            .then((value)=>value.json())
            .then((value)=>value["menu"])
            .then((val)=>val.map((mapVal)=>{
                mapVal["image"] = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${mapVal["image"]}?raw=true`
                return mapVal
            }))
           
            await saveMenuItems(menuFetchedData)
            
            setMenuData(menuFetchedData)
        }
        else{
            console.log("load from database successfully")
            setMenuData(currentMenuData)
        }
        
    }

    const filterItemByCategories = async(searchText,activeCategories)=>{
      
        
        const activeQuery = activeCategories.map((category)=>`category = '${category}' COLLATE NOCASE`)

        const textQuery = !searchText.trim().length?"": `name LIKE '%${searchText.trim()}%'`

        let query = ["SELECT * FROM MenuItem"]
        
        if(activeQuery.length||textQuery!==""){
            query.push("WHERE")
            if(textQuery!==""){
                query.push(textQuery)
            }
            if(activeQuery.length){
                if(textQuery!==""){
                    query.push("AND")
                }
                query.push(activeQuery.join(" OR "))
            }
        }

        const filteredMenuData = await readMenuItems(query.join(" "))
        setMenuData(filteredMenuData)    
    

  }


    //start/initial method when the screen is focused
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', ()=>{        
            fetchProfile()
        })
        return unsubscribe
    }, [navigation])

    //for fetching menu data
    useEffect(
        ()=>{
            init()
        },[]
    )



    // for filtering data
    const activeCategories = Object.keys(statusCategories).reduce((acc, keyElem)=>{
        if(statusCategories[keyElem]){
            acc.push(keyElem)
        }
        return acc
    },[])
    useEffect(
         ()=>{
            filterItemByCategories(searchText, activeCategories)
        }, [statusCategories, searchText]
    )

    return (
        <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS==="ios"?"padding":'height'} >
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
                    <View style={{flexDirection: 'row', flex: 0.9}}>
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
                    <View style={{marginTop: 10}}>
                        <View style={{ flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', borderRadius: 40, backgroundColor: 'white' }}>
                            <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'flex-end'}}>
                                <Ionicons  name="search-outline" size={20} accessibilityLabel="a search circle"></Ionicons>
                            </View>
                            <TextInput value={searchText} onChangeText={setSearchText} style={{flex: 0.9,fontSize: 18, padding: 10}} autoFocus={true}
                            ></TextInput>
                        </View>
                    </View>
                </View>
                <View style ={{ paddingHorizontal: 10, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#cccccc', flex: 0.14}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold',}}>Order for Delivery</Text>
                    <ScrollView horizontal={true} >
                        {
                            Object.keys(statusCategories).map((category)=>{

                               return <CategoryButton key={category} text={category}
                                onPressAction={(newVal)=>{
                                    const newStatus = {...statusCategories}
                                    newStatus[category] = newVal
                                    setStatusCategories(newStatus)
                                }}></CategoryButton>
                            })
                        }
                       
                    </ScrollView>
                </View>
                <View style={{flex: 0.46, marginHorizontal: 10, paddingVertical:5, justifyContent: 'center'}} >
                    {
                    isLoadingMenu?
                    <View style={{flex: 1}}><ActivityIndicator /></View>
                    :menuData===null||!menuData.length?
                        <Text>No menu from {activeCategories.length!==0&&"selected categories"} {activeCategories.length!==0&&"'"+activeCategories.join("/")+"'"} {searchText.trim().length!==0&&", searched text '"+searchText+"'"}</Text>       
                    :<FlatList data={menuData} keyExtractor={(item, index)=>item.name+" "+index} 
                    renderItem={({item})=><CardDish title={item.name} description={item.description} 
                        price={item.price} sourceImage={{uri: item.image}}></CardDish>}
                        ItemSeparatorComponent={<View style={homeStyle.lineSeparator}/>}>
                    </FlatList>
                    }
                </View>
           </View>
           
        </View>
        </KeyboardAvoidingView>
    );
}


const homeStyle = StyleSheet.create({
    headerBox:{
        flex: 0.10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
      },
    heroBox: {flex:0.45, 
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
    },
    lineSeparator: {
        borderBottomWidth: 1, 
        borderBottomColor: '#cccccc',
        marginVertical: 20
    }
})