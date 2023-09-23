import { PanGestureHandler } from "react-native-gesture-handler"
import { useDispatch, useSelector } from "react-redux"
import * as ImagePicker from "expo-image-picker"
import FetchColor from "@styles/fetchTheme"
import { PS } from "@styles/profileStyles"
import { setImage } from "@redux/profile"
import React, { useState } from "react"
import { T } from "@styles/text"

import {
    TouchableOpacity,
    Dimensions,
    Image,
    View,
    Text,
} from "react-native"

import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from "react-native-reanimated"

type ChangeProfileCardProps = {
    theme: number
    lang: boolean
    type?: string
    value?: number
    hide: () => void
    trigger: boolean
}
/**
 * Function for drawing a very small square of the category of the event
 *
 * @param {string} category    Category of the event, Format: "CATEGORY"
 * @returns                     Small circle of the categories color
 */
export default function ChangeProfileCard({theme, lang, type, value, hide,
trigger}: ChangeProfileCardProps): JSX.Element {

    // Dispatch to change Redux states
    const dispatch = useDispatch()

    // Profile info
    let { image } = useSelector((state: ReduxState) => state.profile)

    // Selected local profile image
    const [tempImage, setTempImage] = useState("")

    // Height of the screen window
    let windowHeight = Dimensions.get("window").height

    // Shared value for reanimated library
    let translateY = useSharedValue(windowHeight)

    // Trigger for slideUp animation
    let [shouldTrigger, setShouldTrigger] = useState(trigger)

    // Starts increasing value when swiping starts
    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: CTX) => {
            ctx.startY = translateY.value
        },
        // Changes height according to swiping
        onActive: (event, ctx) => {
            translateY.value = ctx.startY + event.translationY
        },
        // Sets the component to hidden when its not visible
        onEnd: (event) => {
            if (event.velocityY > windowHeight/3) {
                translateY.value = withTiming(windowHeight)
                // tryToHide() not sure if this is needed
            } else {
                translateY.value = withTiming(0)
            }
        },
    })

    // Animates the sliding
    const animation = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        }
    })

    // Slides the card up from the bottom
    const slideUp = () => {
        translateY.value = withTiming(windowHeight/3.6)
    }

    // Checks if it has slid up yet, and slides it up if not
    if (shouldTrigger === true) {
        slideUp()
        setShouldTrigger(false)
    }

    const selectImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            setTempImage(result.assets[0].uri)
            dispatch(setImage(result.assets[0].uri))
        }
    }

    // Tries to hide the component, checks to avoid double calls
    const [hiding, setHiding] = useState(false)
    const tryToHide = () => {
        if (!hiding) {
            setHiding(true)
            runOnJS(() => hide())
        }
    }

    // Returns the visual card component
    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[PS.animatedProfileChangeCard, animation,
                {backgroundColor: FetchColor({theme, variable: "DARKER"})}]}>
                <View style={[PS.animatedView, {backgroundColor:
                    FetchColor({theme, variable: "DARKER"})}]}>
                    <TouchableOpacity onPress={selectImage}>
                        <Image
                            style={PS.bigProfileImage}
                            source={tempImage || image
                                ? {uri: tempImage ? tempImage : image}
                                : theme === 0 || theme === 2 || theme === 3
                                    ? require("@assets/icons/loginperson-white.png")
                                    : require("@assets/icons/loginperson-black.png")}
                        />
                        <Text style={{...T.centered15, color: FetchColor({theme,
                                            variable: "OPPOSITETEXTCOLOR"})}}>
                            {lang ? "Velg bilde" : "Choose image"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </PanGestureHandler>
    )
}