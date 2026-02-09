import { DateTime } from 'luxon'
import mvpsFromStatic from '@/assets/mvps'
import { localStorageMvpsKey, localStorageMvpsShareableKey } from '@/constants.ts'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'

type ComputeTrackingInitialState = (shareable: boolean) => RagnarokMvp[]

export const computeTrackingInitialState: ComputeTrackingInitialState = (shareable) => {
    const jsonState = localStorage.getItem(shareable ? localStorageMvpsShareableKey : localStorageMvpsKey)
    try {
        const parsedState = JSON.parse(jsonState as string)
        const retroState = Array.isArray(parsedState)
            ? parsedState.reduce((merge, mvp) => {
                  return mvp.timeOfDeath ? { ...merge, [mvp.id]: mvp.timeOfDeath } : merge
              }, {})
            : parsedState

        return mvpsFromStatic.map((mvp) => {
            const timeOfDeath = retroState[mvp.id]
            return {
                ...mvp,
                timeOfDeath: timeOfDeath ? DateTime.fromISO(timeOfDeath) : null,
            }
        })
    } catch (error) {
        return mvpsFromStatic
    }
}
