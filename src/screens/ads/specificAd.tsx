import { View, Dimensions } from "react-native"
import { RefreshControl, ScrollView } from "react-native-gesture-handler"
import Cluster from "@/components/shared/cluster"
import AS from "@styles/adStyles"
import { useDispatch, useSelector } from "react-redux"
import React, { useCallback, useState } from "react"
import Swipe from "@components/nav/swipe"
import AdInfo, { 
    AdBanner,
    AdDescription,
    AdMedia,
    AdTitle,
    AdUpdateInfo
} from "@/components/ads/ad"
import { setAd } from "@redux/ad"
import { fetchAdDetails } from "@utils/fetch"
  
export default function SpecificAdScreen(): JSX.Element {

    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { ad } = useSelector((state: ReduxState) => state.ad )
    const [refresh, setRefresh] = useState(false)

    const dispatch = useDispatch()
    const descriptionCheck = 'description_short_no' || 'description_short_en' || 'description_long_no' || 'description_long_en'

    async function getDetails() {
        const response = await fetchAdDetails(ad)

        if (response) {
            dispatch(setAd(response))
            return true
        }
    }
    
    const onRefresh = useCallback(async () => {
        setRefresh(true);
        const details = await getDetails()

        if (details) {
            setRefresh(false)
        }
    }, [refresh]);

    if (!(descriptionCheck in ad)) {
        getDetails()
    }

    return (
        <Swipe left="AdScreen">
            <View>
                <View style={{
                    ...AS.content,
                    backgroundColor: theme.darker,
                    paddingTop: Dimensions.get("window").height / 9.7,
                    paddingBottom: Dimensions.get("window").height / 3
                }}>
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        scrollEventThrottle={100}
                        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                    >
                        <Cluster marginHorizontal={12} marginVertical={12}>
                            <AdBanner url={ad.banner_image} />
                            <AdTitle ad={ad} />
                            <AdInfo ad={ad} />
                            <AdDescription ad={ad} />
                            <AdMedia ad={ad} />
                            <AdUpdateInfo ad={ad} />
                        </Cluster>
                    </ScrollView>
                </View>
            </View>
        </Swipe>
    )
}
