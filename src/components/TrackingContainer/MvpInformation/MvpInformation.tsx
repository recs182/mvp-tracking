import { memo, type ReactElement } from 'react'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'
import { MvpInformationStyled } from '@/components/TrackingContainer/MvpInformation/styles.ts'

interface MvpInformationProps {
    name: string
    map: string
    spawnTime: RagnarokMvp['spawnTime']
}

function minutesToHoursMinutes(totalMinutes: number): string {
    const safe = Math.max(0, Math.floor(totalMinutes)) // optional: avoid negatives/decimals

    const hours = Math.floor(safe / 60)
    const minutes = safe % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const MvpInformation = memo<MvpInformationProps>(({ map, name, spawnTime }): ReactElement => {
    const minTime = minutesToHoursMinutes(spawnTime.minMinutes)
    const maxTime = minutesToHoursMinutes(spawnTime.maxMinutes)

    const noVariation = minTime === maxTime
    const spawnTimeLabel = noVariation ? minTime : `${minTime}~${maxTime}`

    return (
        <MvpInformationStyled>
            <div>{name}</div>
            <div>
                Map: <strong>{map}</strong>
            </div>
            <div>
                Spawn time: <strong>{spawnTimeLabel}</strong>
            </div>
        </MvpInformationStyled>
    )
})
