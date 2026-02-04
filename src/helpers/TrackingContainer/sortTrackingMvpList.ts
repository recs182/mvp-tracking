import type { RagnarokMvp } from '@/containers/TrackingContainer/types'
import { computeMvpDifferenceTimers } from '@/helpers/TrackingContainer'

export const sortTrackingMvpList = (a: RagnarokMvp, b: RagnarokMvp) => {
    const aHasTime = Boolean(a.timeOfDeath)
    const bHasTime = Boolean(b.timeOfDeath)

    // 1) timeOfDeath first
    if (aHasTime !== bHasTime) return aHasTime ? -1 : 1

    // 2) if both have timeOfDeath:
    if (aHasTime && bHasTime) {
        const { minimumDifferenceInMinutes: aDiffRaw } = computeMvpDifferenceTimers(a)
        const { minimumDifferenceInMinutes: bDiffRaw } = computeMvpDifferenceTimers(b)

        const aDiff = Number(aDiffRaw)
        const bDiff = Number(bDiffRaw)

        const aIsNonNegative = aDiff >= 0
        const bIsNonNegative = bDiff >= 0

        // a is negative and b is not
        if (aIsNonNegative && !bIsNonNegative) {
            return -1
        }

        // a is not negative and b is
        if (!aIsNonNegative && bIsNonNegative) {
            return 1
        }

        // a and b are both non-negative, compare time difference directly
        if (aIsNonNegative && bIsNonNegative) {
            return aDiffRaw > bDiffRaw ? -1 : 1
        }

        // a and b are both negative, compare time difference directly
        if (!aIsNonNegative && !bIsNonNegative) {
            return aDiffRaw > bDiffRaw ? -1 : 1
        }
    }

    // 3) fallback: alphabetical
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
}
