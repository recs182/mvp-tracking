import type { FC, ReactElement } from 'react'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'
import { MvpInformationStyled } from '@/components/TrackingContainer/MvpInformation/styles.ts'

interface MvpInformationProps {
    name: string
    map: string
    spawnTime: RagnarokMvp['spawnTime']
}

export const MvpInformation: FC<MvpInformationProps> = ({ map, name, spawnTime }): ReactElement => {
    return (
        <MvpInformationStyled>
            <div>{name}</div>
            <div>
                Map: <strong>{map}</strong>
            </div>
            <div>
                Spawn time:{' '}
                <strong>
                    {spawnTime.minMinutes}~{spawnTime.maxMinutes}
                </strong>
            </div>
        </MvpInformationStyled>
    )
}
