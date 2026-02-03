import { localStorageMvpsKey } from '@/constants.ts'
import { DateTime } from 'luxon'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types.ts'

type GetInitialTrackingStateFromLocalStorage = () => RagnarokMvp[] | null

export const getInitialTrackingStateFromLocalStorage: GetInitialTrackingStateFromLocalStorage = () => {
    const jsonState = localStorage.getItem(localStorageMvpsKey)
    try {
        const parsedState = JSON.parse(jsonState as string)
        return parsedState.map((mvp: any) => {
            return { ...mvp, timeOfDeath: mvp.timeOfDeath ? DateTime.fromISO(mvp.timeOfDeath) : null }
        })
    } catch (error) {
        return null
    }
}
