
import { View, Text, Image, StyleSheet } from "react-native";

export default function ProfilePicture ({source, defaultText, width, height}){
    if(source===null || !('uri' in source) || ('uri' in source && source['uri']===null)){
        return (
        <View style={{backgroundColor: '#89a6b8', padding: 10, borderRadius:20, width: width, height: height, justifyContent: 'center'}}>
            <Text style={{color: 'white', textAlign: 'center', fontSize: width/3 }}>{defaultText}</Text>
        </View>
        )
    }

    return (
        <Image source={source} accessibilityLabel="selected picture" style={{borderRadius: 40}} width={width} height={height}></Image>
    )
}
