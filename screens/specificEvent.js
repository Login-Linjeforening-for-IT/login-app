{/* ========================= IMPORTING NEEDED LIBRARIES ========================= */}
import CategoryCircle from '../shared/eventComponents/categoryCircle';
import CategorySquare from '../shared/eventComponents/categorySquare';
import CleanDescription from '../shared/eventComponents/cleanDescription';
import { GetEndTime, Month, EventLocation } from '../shared/eventComponents/otherComponents';
import React, { useEffect, useState } from 'react';
import Card, { CardSmaller, Space } from '../shared/sharedComponents';
import { StatusBar } from 'expo-status-bar';
import EventTime from '../shared/eventComponents/eventTime';
import { GS } from '../styles/globalStyles';
import { MS } from '../styles/menuStyles';
import { T } from '../styles/text';
import { ES } from '../styles/eventStyles';
import { 
  Text, 
  View, 
  Image, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';


{/* ========================= APP START ========================= */}

export default function SpecificEventScreen({ route, navigation}) {
  const { item } = route.params
  const [usersData,setUsersData]=useState({})

  const getData=()=>{
    fetch('https://api.login.no/events/' + item.eventID)
    // fetch('https://tekkom:rottejakt45@api.login.no:8443') //TESTING
    .then(response => response.json())
    .then(data=>setUsersData(data))
  }
  useEffect(() => {
    getData();
    },[])

  const listingPage = () => { navigation.navigate('ListingScreen') }
  const eventPage   = () => { navigation.navigate('EventScreen')   }
  const homePage    = () => { navigation.navigate('HomeScreen')    }
  const profilePage = () => { navigation.navigate('ProfileScreen') }
  const goBack      = () => { navigation.navigate('EventScreen')   }

  //Logs correctly
  // console.log('https://cdn.login.no/img/events/' + usersData.image)

  return(
    <View>
      <StatusBar style="light" />
{/* ========================= DISPLAY TOP MENU ========================= */}
  <View style={MS.topMenu}>
    <TouchableOpacity onPress={() => goBack()}>
      <Image style={MS.goBack} source={require('../assets/goback777.png')} />
    </TouchableOpacity>
      <TouchableOpacity onPress={() => profilePage()}>
        <Image style={MS.tMenuIcon} source={require('../assets/loginperson.png')} />
      </TouchableOpacity>
  </View>

{/* ========================= DISPLAY CONTENT ========================= */}
      <View style={GS.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {Space(5)}

            <View style={ES.specificEventView1}>
              {/* Doesnt work */}
              <Image style={ES.specificEventImage} source={require('../assets/default.png')}/>
              {/* <Image style={ES.specificEventImage} source={{uri: 'https://cdn.login.no/img/events/' + usersData.image}} /> */}
            </View>

            {Space(5)}
          
            <CardSmaller>
              <View style={ES.specificEventInfoView}>
                  <Card>
                    {CategorySquare(item.category)} 
                    <Text style={ES.dayText}>
                        {item.startt[8]}
                        {item.startt[9]}
                    </Text>

                    <Text style={ES.monthText}>
                    {Month(item.startt[5] + item.startt[6])}
                    </Text>
                  </Card>
                  <Card>
                    <Text>{EventTime(item.startt, usersData.endt)}</Text>
                  </Card>
              </View>
            </CardSmaller>

            {Space(5)}
            <Card>
              <View style={ES.specificEventInfoView}>
                <Text style={T.specificEventInfo}>Starter: </Text>
                <Text style={T.specificEventInfo}>
                  {item.startt[11]}
                  {item.startt[12]}:
                  {item.startt[14]}
                  {item.startt[15]}
                </Text>
              </View>

              {Space(5)}

              <View style={ES.specificEventInfoView}>
              <Text style={T.specificEventInfo}>Slutter: </Text>
                {GetEndTime(usersData.endt)}
                
              </View>

              {Space(5)}

              {EventLocation(usersData.roomno, usersData.campus)}

              {Space(5)}

              <View style={ES.specificEventInfoView}>
                <Text style={T.specificEventInfo}>Kategori: </Text>
                {CategoryCircle(item.category)}
                <Text style={T.specificEventInfo}>
                  {item.category}
                </Text>
              </View>

              {Space(5)}

              <View style={ES.specificEventInfoView}>
                <Text style={T.specificEventInfo}>Arrangør: </Text>
                <Text style={T.specificEventInfo}>
                  {item.organizer}
                </Text>
              </View>
           </Card>

           {Space(5)}
            <Card>
              <View>{Space(5)}
                <Text style={T.centered20}>{item.eventname}</Text>
              </View>
              {CleanDescription(usersData.description)}
            </Card>
        </ScrollView>
      </View>   
       
{/* ========================= DISPLAY BOTTOM MENU ========================= */}
      <View style={MS.bMenu}>
        <TouchableOpacity onPress={() => homePage()}>
            <Image style={MS.bMenuIcon} source={require('../assets/house777.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eventPage()}>
            <Image style={MS.bMenuIcon} source={require('../assets/calendar-orange.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => listingPage()}>
            <Image style={MS.bMenuIcon} source={require('../assets/business.png')} />
          </TouchableOpacity>
      </View>     
    </View>
  )
};