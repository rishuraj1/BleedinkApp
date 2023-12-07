import { View, Text } from 'react-native'
import React from 'react'
import { Paragraph, Tooltip } from 'tamagui'

const MyTooltip = () => {
  return (
    <Tooltip>
        <Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow />
                <Paragraph size="$2" lineHeight="$1">
                    This is a tooltip
                </Paragraph>
            </Tooltip.Content>
        </Tooltip.Trigger>
    </Tooltip>
  )
}

export default MyTooltip