import { useState } from "react";
import {  View,Text,StyleSheet, Pressable} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'

export default function CategoryButton({text, onPressAction}){
    const [isActivated, setActivation] = useState(false);

   return ( <Pressable style={[CategoryButtonStyle.container, {backgroundColor: isActivated?'#495850':'#edefee'}]}
         onPress={()=>{
                setActivation(!isActivated)
                //onPressAction()
            }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[CategoryButtonStyle.text, {color: isActivated?'#f4ce14':'#495e57'}]}>{text}</Text>
            {isActivated&&<Ionicons name="close-outline" size={25} color={'white'}></Ionicons>}
        </View>
    </Pressable>)
}

const CategoryButtonStyle = StyleSheet.create(
    {
        container: {
            backgroundColor: 'white',
            paddingVertical: 7,
            paddingHorizontal: 10,
            borderRadius: 20,
            marginTop: 7,
            marginHorizontal: 10,
            height: 40
        },
        text: {
            fontSize: 18,
            fontWeight: 'bold'
        }
    }
)