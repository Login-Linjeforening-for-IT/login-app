import { ES } from 'login/styles/eventStyles';
import { View, Image } from 'react-native';

/**
 * Small bell icon used to subscribe to event and job advertisement updates
 * @returns {JSX.Element} Bell icon
 */
export default function BellIcon({orange, theme}) {
    let icon = require('login/assets/icons/bell.png');
    let isDark = theme == 0 || theme == 2 || theme == 3 ? true : false 

    if (orange)         icon = require('login/assets/icons/bell-orange.png');
    else if (isDark)    icon = require('login/assets/icons/bell.png');
    else                icon = require('login/assets/icons/bell-black.png');

    return(
        <View>
            <Image style={ES.bellSize} source={icon} />
        </View>
    )
};