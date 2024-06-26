import { StaticImage } from "@components/about/social"
import ES from "@styles/eventStyles"
import { Dimensions, Image } from "react-native"
import { SvgUri } from "react-native-svg"
import { useSelector } from "react-redux"

export default function SpecificEventImage() {
    const { event } = useSelector((state: ReduxState) => state.event)

    if ((event.image_small).includes(".svg")) {
        return (
            <SvgUri
                style={{alignSelf: "center", marginTop: 8}}
                width={(Dimensions.get("window").width)/1.2}
                height={Dimensions.get("window").width/3}
                uri={`https://cdn.login.no/img/events/${event.image_small}`}
            />
        )
    } 
    
    if (event.image_small.includes(".png")) {
        return <Image
            style={ES.specificEventImage}
            source={{uri: `https://cdn.login.no/img/events/banner/${event.image_small}`}}
        />
    } 
    
    return <StaticImage event={event} />
}