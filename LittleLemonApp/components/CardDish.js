import { View , StyleSheet, Image, Text} from "react-native";
export default function CardDish({title, description, price, sourceImage}){
    return ( <View style={CardDishStyle.container}>
            <View style={{flex: 0.7, paddingEnd: 8}}>
                <Text style={CardDishStyle.headerText}>{title}</Text>
                <Text numberOfLines={2} style={CardDishStyle.descriptionText}>{description}</Text>
                <Text style={CardDishStyle.priceText}>$ {price}</Text>
            </View>
            <View style={{flex: 0.3, justifyContent: 'center'}} >
                <Image source={sourceImage} style={{width: 100, height: 105, borderRadius: 10}} resizeMode="cover"></Image>
            </View>
        </View>)
}

const CardDishStyle = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    headerText:{
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1
    },
    priceText:{
        fontSize: 16,
        color: '#5b6e68',
        fontWeight: '700'
    },
    descriptionText:{
        marginVertical: 7
    }
})