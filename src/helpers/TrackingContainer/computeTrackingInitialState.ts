import { DateTime } from 'luxon'
import mvpsFromJson from '@/assets/mvps.json'
import { localStorageMvpsKey } from '@/constants.ts'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'

type ComputeTrackingInitialState = () => RagnarokMvp[] | null

export const computeTrackingInitialState: ComputeTrackingInitialState = () => {
    const jsonState = localStorage.getItem(localStorageMvpsKey)
    try {
        const parsedState = JSON.parse(jsonState as string)
        const retroState = Array.isArray(parsedState)
            ? parsedState.reduce((merge, mvp) => {
                  return mvp.timeOfDeath ? { ...merge, [mvp.id]: mvp.timeOfDeath } : merge
              }, {})
            : parsedState

        return mvpsFromJson.map((mvp) => {
            const timeOfDeath = retroState[mvp.id]
            return {
                ...mvp,
                timeOfDeath: timeOfDeath ? DateTime.fromISO(timeOfDeath) : null,
            }
        })
    } catch (error) {
        return mvpsFromJson
    }
}
