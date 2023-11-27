import { View, Text } from 'react-native'
import React from 'react'

const Postscreen = ({ route }) => {
    const { endpoint, title, userId } = route?.params;
    return (
        <View>
            <Text>{endpoint}</Text>
        </View>
    )
}

export default Postscreen