import Card, { CardSmaller } from "@components/shared/card"
import CategorySquare from "@components/shared/category"
import ES from "@styles/eventStyles"
import { View } from "react-native"
import EventTime from "./time"
import { useSelector } from "react-redux"

export default function Countdown() {
    const { event } = useSelector((state: ReduxState) => state.event)
    if (!event.event) return null

    const startDate = event.event.time_start ? new Date(event.event.time_start) : new Date()
    const endDate = event.event.time_type=="default" ? new Date(event.event.time_end) : undefined

    return (
        <CardSmaller>
            <View style={ES.specificEventInfoView}>
                <Card>
                    <View style={{}}>
                        <CategorySquare color={event.category.color} startDate={startDate} endDate={endDate}/>
                    </View>
                </Card>
                <EventTime time_start={event.event.time_start} time_end={event.event.time_end} />
            </View>
        </CardSmaller>
    )
}