import { DateTime } from 'luxon'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types.ts'

type ComputeMvpDifferenceTimers = (mvp: RagnarokMvp) => {
    maximumDifferenceInMinutes: number
    minimumDifferenceInMinutes: number
}

export const computeMvpDifferenceTimers: ComputeMvpDifferenceTimers = (mvp) => {
    const { spawnTime, timeOfDeath } = mvp

    if (!timeOfDeath) {
        return {
            maximumDifferenceInMinutes: 0,
            minimumDifferenceInMinutes: 0,
        }
    }

    const dateUTC = DateTime.now().setZone('Europe/London')

    const maximumSpawnTime = timeOfDeath.plus({ minutes: spawnTime.maxMinutes })
    const maximumDifferenceInMinutes = dateUTC.diff(maximumSpawnTime, ['minutes']).toObject().minutes

    const minimalSpawnTime = timeOfDeath.plus({ minutes: spawnTime.minMinutes })
    const minimumDifferenceInMinutes = dateUTC.diff(minimalSpawnTime, ['minutes']).toObject().minutes

    return {
        maximumDifferenceInMinutes: maximumDifferenceInMinutes ?? 0,
        minimumDifferenceInMinutes: minimumDifferenceInMinutes ?? 0,
    }
}
