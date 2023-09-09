function transStateMap(arr){
    return {
        value: arr[0],
        setValue: arr[1]
    }
}

import { Alert } from "react-native"
function dialogueConfirm(title, msg,action,confirmText="Yes", cancelText="Cancel"){
    Alert.alert(
        title, msg, [
            {
              text: cancelText,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: confirmText,
             onPress: () => action()
            },
          ]
    )
}


export {transStateMap, dialogueConfirm}
