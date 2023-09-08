import { nativeApplicationVersion } from "expo-application";
import Feedback from "../shared/components/feedback";
import Cluster from 'login/shared/functions/cluster';
import Space from "login/shared/components/utils";
import FetchColor from 'login/styles/fetchTheme';
import { CS } from 'login/styles/clusterStyles';
import { GS } from 'login/styles/globalStyles';
import { ES }from 'login/styles/eventStyles';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import TopMenu from 'login/shared/topMenu';
import { T } from 'login/styles/text';
import { 
  Text, 
  View, 
  Image, 
  FlatList,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert
} from 'react-native';

{/* ========================= APP START ========================= */}

export default function MenuScreen({ navigation }) {

    const { lang  } = useSelector( (state) => state.lang  )
    const { login } = useSelector( (state) => state.login )
    const { theme } = useSelector( (state) => state.theme )
    const { id, name, image } = useSelector( (state) => state.profile )
    const profile = { id: 0, name: "Eirik Hanasand", image}
    
    const [setting] = useState([
        {id: '1', nav: 'SettingScreen',       titleNO: 'Innstillinger',   titleEN: 'Settings'       },
        //{id: '2', nav: 'ReportScreen',        titleNO: 'Varsle',          titleEN: 'Report'         },
        {id: '3', nav: 'AboutScreen',         titleNO: 'Om oss',          titleEN: 'About Login'    },
        {id: '4', nav: 'BusinessScreen',      titleNO: 'For bedrifter',   titleEN: 'For companies'  },
        {id: '5', nav: 'LoginScreen',         titleNO: 'Innsida (verv)',  titleEN: 'Intranet (verv)'},
    ])
    const [feedback, setFeedback] = useState({status: 0})                   //  Feedback options visibility boolean

    function toggleFeedback() {                                             //  --- UPDATES FEEDBACK STATE ---
        setFeedback({                                                         //  Function to show feedback types
            status: !feedback.status                                       //  Change feedback state
        });
    }

    return(
        <View>
            <View style={{...GS.content, backgroundColor: FetchColor(theme, 'DARKER')}}>
                <FlatList
                style={{minHeight: '100%'}}
                showsVerticalScrollIndicator={false}
                numColumns={1}
                keyExtractor={(item) => item.id}
                data={setting}
                renderItem={({item, index}) => (
                    <View>
                        {index == 0 ? Space(Dimensions.get('window').height/8): null}
                        {/* {index == 0 ? SmallProfile(navigation, theme, lang, profile, login) : null} */}
                        <TouchableOpacity onPress={() => item.id == 5 && login ? navigation.navigate('InternalScreen', item) : navigation.navigate(item.nav, item)}>
                        <Cluster>
                            <View style={{...CS.clusterBack}}>
                                <View style={CS.twinLeft}>
                                    <Text style={{...T.text20, color: FetchColor(theme, 'TEXTCOLOR')}}>{lang ? item.titleNO : item.titleEN}</Text>
                                </View>
                                <View style={CS.twinRight}>
                                    <Image style={CS.arrowImage} source={require('login/assets/icons/dropdownBase.png')}/>
                                </View>
                            </View>
                        </Cluster>
                        </TouchableOpacity>
                        <View>
                        {Space(10)}
                        <Feedback
                            index={index}
                            setting={setting}
                            feedback={feedback}
                            theme={theme}
                            lang={lang}
                            toggleFeedback={toggleFeedback}
                        />
                    </View>
                    {index == setting.length-1 ? <Text style={{...T.contact, color: FetchColor(theme, 'OPPOSITETEXTCOLOR')}}>{lang ? `Versjon ${nativeApplicationVersion}` : `Version ${nativeApplicationVersion}`}</Text>:null}
                </View>
                    
                )}
                />
                {Space(Dimensions.get('window').height/10)}
            </View>    
            <TopMenu navigation={navigation} title={lang ? "Meny" : "Menu"}/>    
        </View>
    )
};

