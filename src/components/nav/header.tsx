import GS from '@styles/globalStyles'
import React, { PropsWithChildren, ReactNode, useState } from 'react'
import { BlurView } from 'expo-blur'
import { Dimensions, Platform, View, Text, StatusBar } from 'react-native'
import { HeaderProps} from '@interfaces'
import { useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import { Image } from "react-native"
import MS from '@styles/menuStyles'
import { useDispatch } from 'react-redux'
import { setTag } from '@redux/event'

export default function Header({ options, route, navigation }: HeaderProps): ReactNode {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang  } = useSelector((state: ReduxState) => state.lang)
    const { event, tag } = useSelector((state: ReduxState) => state.event)
    const { ad } = useSelector((state: ReduxState) => state.ad )
    const dispatch = useDispatch()
    const SES = route.name === "SpecificEventScreen"
    const SAS = route.name === "SpecificAdScreen"
    const orangeIcon = require('@assets/icons/goback-orange.png')
    let title = route.name && (lang
            ? require('@text/no.json').screens[route.name]
            : require('@text/en.json').screens[route.name])
    
    if (!title && SES) title = lang ? event.name_no : event.name_en
    if (!title && SAS) title = lang ? ad.title_no : ad.title_en
    if (route.name === "ProfileScreen") return <></>
    // if (tag && !SES) {
    //     setTimeout(() => {
    //         if (tag && !SES) dispatch(setTag(''))
    //     }, 500);
    // }

    const { isDark } = useSelector((state: ReduxState) => state.theme )
    const  [backIcon, setBackIcon] = useState(isDark 
        ? require('@assets/icons/goback777.png')
        : require('@assets/icons/goback111.png'))

    return (
        <BlurWrapper>
            <View style={{...GS.headerView, top: title.length > 40 ? 
                Dimensions.get("window").height / 17 - 12
                : Dimensions.get("window").height / 17
            }}>
                <View style={GS.innerHeaderViewOne}>
                    {options.headerComponents?.left ? options.headerComponents?.left.map((node, index) => 
                        <View style={GS.logo} key={index}>{node}</View> 
                    ) : 
                    <TouchableOpacity onPress={() => {
                        setBackIcon(orangeIcon)
                        if (tag) dispatch(setTag(''))
                        navigation.goBack()
                    }}>
                        <Image style={{...MS.tMenuIcon, left: 5}} source={backIcon}></Image>
                    </TouchableOpacity>
                    }
                </View>
                <Text style={{...GS.headerTitle, color: theme.titleTextColor, 
                            width: SES ? 300 : 150, textAlign: "center"}}>
                            {title}
                        </Text>
                    <View style={GS.innerHeaderViewTwo}>
                    {options.headerComponents?.right?.map((node, index) => (
                        <View style={index === 1
                            ? {...GS.customMenuIcon, width: Platform.OS === "ios" ? 28 : 5} 
                            : GS.customMenuIcon} key={index}>{node}
                        </View>
                    ))}
                </View>
            </View>
            {options.headerComponents?.bottom?.map((node, index) => 
                <View key={index}>{node}</View>
            )}
        </BlurWrapper>
    )
}

// Wraps the content in blur
function BlurWrapper(props: PropsWithChildren) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const event = useSelector((state: ReduxState) => state.event)
    const ad = useSelector((state: ReduxState) => state.ad)
    const route = useRoute()
    const defaultHeight = Dimensions.get('window').height * 8 / 100 + (StatusBar.currentHeight ? StatusBar.currentHeight - 7 : 0)
    const isSearchingEvents = event.search && route.name === "EventScreen"
    const isSearchingAds = ad.search && route.name === "AdScreen"
    const cat = lang ? event.categories.no : event.categories.en
    const categories = cat.length || 0
    const extraHeight = (isSearchingEvents && 6 * categories) || (isSearchingAds && 9.5 * ad.skills.length) || 0
    const height = defaultHeight + extraHeight + (isSearchingEvents || isSearchingAds
        ? Platform.OS === "ios" ? 120 : 110
        : Platform.OS === "ios" ? 20 : 5)

    return (
        <>
            <BlurView 
                style={{height}} 
                experimentalBlurMethod='dimezisBlurView' 
                intensity={Platform.OS === "ios" ? 30 : 20} 
            />
            <View style={{...GS.blurBackgroundView, height,
                backgroundColor: theme.transparentAndroid
            }}>{props.children}</View>
        </>
    )
}
