import AdList from "@components/ads/adList"
import DownloadButton from "@components/shared/downloadButton"
import GS from "@styles/globalStyles"
import Header from "@components/nav/header"
import LastFetch, { fetchAdDetails, fetchAds } from "@/utils/fetch"
import LogoNavigation from "@/components/shared/logoNavigation"
import NavigateFromPushNotification 
from "@/utils/navigateFromPushNotification"
import React, { useEffect, useState } from "react"
import SpecificAdScreen from "./specificAd"
import Swipe from "@components/nav/swipe"
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { FilterButton, FilterUI } from "@components/shared/filter"
import { ScreenProps } from "@interfaces"
import { StatusBar } from "expo-status-bar"
import { setAds, setLastFetch, setLastSave } from "@redux/ad"
import { useFocusEffect } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { View } from "react-native"

const AdStack = createStackNavigator<AdStackParamList>()

/**
 * Parent AdScreen component
 *
 * Handles:
 * - Displaying ads
 * - Filtering ads
 * - Notification Management
 * - Ad notifications, both scheduling and cancelling
 *
 * @param {navigation} Navigation Navigation route
 * @returns AdScreen
 */
export default function AdScreen({ navigation }: ScreenProps): JSX.Element {
    // Push notification
    const [pushNotification, setPushNotification] = useState(false)
    const [pushNotificationContent, setPushNotificationContent] = 
        useState<JSX.Element | undefined>(undefined)
    
    // Redux states
    const { search, lastSave } = useSelector((state: ReduxState) => state.ad)
    const { theme, isDark } = useSelector((state: ReduxState) => state.theme)
    const dispatch = useDispatch()

    // Navigates if the app is opened by a push notification
    NavigateFromPushNotification({navigation, theme,
        setPushNotification, setPushNotificationContent})

    // Fetches ads when screen is focused
    useFocusEffect(
        // Callback to avoid too many rerenders
        React.useCallback(() => {
            // Function to fetch clicked ads
            (async() => {
                const ads = await fetchAds()

                if (ads) {
                    dispatch(setAds(ads))
                    dispatch(setLastFetch(LastFetch()))
                }
            })()
        }, [])
    )

    // Loads initial data
    useEffect(() => {
        // IIFE to fetch API
        (async() => {
            const ads = await fetchAds()

            if (ads) {
                dispatch(setAds(ads))
                dispatch(setLastFetch(LastFetch()))
            }
        })()

    // Renders when the screen is loaded
    }, [])

    // Fetches API and updates cache every 10 seconds
    useEffect(() => {
        let interval: Interval = 0

        // Only when filter is closed to prevent "no match" issue
        if (!search) {
            interval = setInterval(() => {
                // Storing the current time
                (async() => {
                    const ads = await fetchAds()

                    if (ads) {
                        const detailedAdPromises = ads.map(async(ad) => {
                            const details = await fetchAdDetails(ad)
                            return details
                        })

                        const detailedAds = await Promise.all(detailedAdPromises)

                        dispatch(setAds(detailedAds))
                        dispatch(setLastFetch(LastFetch()))
                    }
                })()
                // Runs every 10 seconds
            }, 10000)
            // Clears the interval when the filter is opened
        } else clearInterval(interval)

        // Clears interval when unmounted to prevent memory leaks
        return () => clearInterval(interval)
    }, [search])

    useEffect(() => {
        // --- SETUP CODE ONCE APP IS DOWNLOADED---
        // Displays when the API was last fetched successfully
        if (lastSave === "") {(async() => {dispatch(setLastSave(LastFetch()))})()
    }
    }, [lastSave])

    // --- DISPLAYS THE EVENTSCREEN ---
    return (
        <AdStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props} />
        }}>
            <AdStack.Screen name="AdScreen">
                {({navigation}) => {
                    // --- SET THE COMPONENTS OF THE HEADER ---
                    useEffect(()=>{
                        navigation.setOptions({
                            headerComponents: {
                                bottom: [<FilterUI />],
                                left: [<LogoNavigation />],
                                right: [<FilterButton />, <DownloadButton />]
                            }} as Partial<BottomTabNavigationOptions>)   
                    },[navigation])

                    return (
                        <Swipe right="AdScreenRoot">
                            <View>
                                <StatusBar style={isDark ? "light" : "dark"} />
                                <View style={{
                                    ...GS.content,
                                    paddingHorizontal: 5,
                                    backgroundColor: theme.darker
                                }}>
                                    {pushNotification && pushNotificationContent}
                                    <AdList />
                                </View>
                            </View>
                        </Swipe>
                    )}}
            </AdStack.Screen>
            <AdStack.Screen 
                name="SpecificAdScreen"
                component={SpecificAdScreen}
            />
        </AdStack.Navigator>
    )
}
