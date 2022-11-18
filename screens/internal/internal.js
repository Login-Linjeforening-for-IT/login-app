{/* ========================= IMPORTING NEEDED LIBRARIES ========================= */}
import { StatusBar } from 'expo-status-bar'
import { MS } from '../../styles/menuStyles'
import { GS } from '../../styles/globalStyles'
import { T } from '../../styles/text'
import { Internal } from '../../styles/internalStyles'
import { useState } from 'react';
import Card from '../../shared/card';


import { 
  Text, 
  View, 
  Image, 
  FlatList,
  TouchableOpacity
} from 'react-native';

{/* ========================= APP START ========================= */}

export default function InternalScreen({ navigation }) {
    const [setting] = useState([
      {id: '1', nav: 'EditScreen', title: 'Endre'},
      {id: '2', nav: 'NotificationScreen', title: 'Varslinger'},
      {id: '3', nav: 'TodoScreen', title: 'Gjøremål'},
      {id: '4', nav: 'MakeNotificationScreen', title: 'Send Varsling'},

  ])
{/* ========================= DISPLAY APP START ========================= */}
const eventPage = () => {
  navigation.navigate('EventScreen');
}
const homePage = () => {
  navigation.navigate('HomeScreen');
}
const [data, setData] = useState({
  theme: 0,
  lang: 0
}) 

const changeTheme = () => {
  setData({
    ...data,
    theme: !data.theme
  });
}

const changeLang = () => {
  setData({
    ...data,
    lang: !data.lang
  });
}

  return(
    <View style={MS.backGround}>
      <StatusBar style="light" />
{/* ========================= DISPLAY TOP MENU ========================= */}
      <View style={MS.topMenu}>
      <TouchableOpacity onPress={() => aboutPage()}>
          <Image style={MS.tMenuL} source={require('../../assets/login-text.png')} />
        </TouchableOpacity>
        <View style={MS.tMenuIcons}>
      <TouchableOpacity onPress={() => changeLang()}>
        {data.lang ?
          <Text style={MS.tMenuR3}>EN</Text>
        : 
        <Text style={MS.tMenuR3}>NO</Text>
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeTheme()}>
        {data.theme ?
          <Image style={MS.tMenuR2} source={require('../../assets/sun777.png')} />
        : 
          <Image style={MS.tMenuR2} source={require('../../assets/moon777.png')} />
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={() => lightSwitch()}>
        <Image style={MS.tMenuR} source={require('../../assets/loginperson777.png')} />
      </TouchableOpacity>
    </View>
      </View>

{/* ========================= DISPLAY CONTENT ========================= */}
      <View style={GS.content}>
          <FlatList
          showsVerticalScrollIndicator={''}
          numColumns={1}
          keyExtractor={(item) => item.id}
          data={setting}
          renderItem={({item}) => (
            <View>
            <TouchableOpacity onPress={() => navigation.navigate(item.nav, item)}>
              <Card style={Internal.creditCard}>
                <Text style={Internal.text}>{item.title}</Text>
              </Card>
            </TouchableOpacity>
          </View>
          )}
          />
      </View>    

{/* ========================= DISPLAY BOTTOM MENU ========================= */}
      <View style={MS.bMenuWhenNoTop}>
      <TouchableOpacity onPress={() => homePage()}>
        <Image style={MS.bMenu3} source={require('../../assets/house777.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => eventPage()}>
        <Image style={MS.bMenu2} source={require('../../assets/calendar777.png')} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image style={MS.settingsSelected} source={require('../../assets/menu-orange.png')} />
      </TouchableOpacity>
      </View>     
    </View>
    
  )
};
