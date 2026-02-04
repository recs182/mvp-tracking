import { DateTime } from 'luxon'
import mvpsFromJson from '@/assets/mvps.json'
import { localStorageMvpsKey } from '@/constants.ts'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'

type GetInitialTrackingStateFromLocalStorage = () => RagnarokMvp[] | null

export const getInitialTrackingStateFromLocalStorage: GetInitialTrackingStateFromLocalStorage = () => {
    const jsonState = localStorage.getItem(localStorageMvpsKey)
    try {
        const parsedState = JSON.parse(jsonState as string)
        return parsedState.map((mvp: any) => {
            const sprite = mvpsFromJson.find((mvps) => mvps.id === mvp.id)?.sprite
            return { ...mvp, sprite, timeOfDeath: mvp.timeOfDeath ? DateTime.fromISO(mvp.timeOfDeath) : null }
        })
    } catch (error) {
        return null
    }
}
