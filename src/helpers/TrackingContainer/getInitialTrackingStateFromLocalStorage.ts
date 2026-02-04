import { DateTime } from 'luxon'
import mvpsFromJson from '@/assets/mvps.json'
import { localStorageMvpsKey } from '@/constants.ts'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'

type GetInitialTrackingStateFromLocalStorage = () => RagnarokMvp[] | null

// changes in the data can be done here for refresh update without losing all timers
export const getInitialTrackingStateFromLocalStorage: GetInitialTrackingStateFromLocalStorage = () => {
    const jsonState = localStorage.getItem(localStorageMvpsKey)
    try {
        const parsedState = JSON.parse(jsonState as string)
        return parsedState.map((mvp: any) => {
            const foundMvp = mvpsFromJson.find((mvps) => mvps.id === mvp.id)
            return {
                ...mvp,
                name: foundMvp?.name ?? mvp.name,
                spawnTime: foundMvp?.spawnTime ?? mvp.spawnTime,
                sprite: foundMvp?.sprite,
                timeOfDeath: mvp.timeOfDeath ? DateTime.fromISO(mvp.timeOfDeath) : null,
            }
        })
    } catch (error) {
        return null
    }
}
