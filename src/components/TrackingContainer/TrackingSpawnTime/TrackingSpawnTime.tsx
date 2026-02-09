import { Fragment, memo, type ReactElement, useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
// app
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'
import { computeMvpDifferenceTimers } from '@/helpers/TrackingContainer'
import { defaultTimeZoneName } from '@/constants'
// self
import { RelativeDateContainer, TimerContainer } from './styles.ts'

interface TrackingSpawnTimeProps {
    mvp: RagnarokMvp
}

type MemoReturn = {
    maximumDifferenceInMinutes?: number
    minimumDifferenceInMinutes?: number
    variations: {
        aboutToStart: boolean
        alreadyEnded: boolean
        alreadyStarted: boolean
        endedMinutesAgo: boolean
    }
}

export const TrackingSpawnTime = memo<TrackingSpawnTimeProps>(({ mvp }): ReactElement => {
    const [autoUpdate, setAutoUpdate] = useState<number>(0)

    const { maximumDifferenceInMinutes, minimumDifferenceInMinutes, variations } = useMemo<MemoReturn>(() => {
        const dateUTC = DateTime.now().setZone(defaultTimeZoneName)

        if (!mvp.timeOfDeath) {
            return {
                maximumSpawnTime: dateUTC,
                minimalSpawnTime: dateUTC,
                variations: {
                    aboutToStart: false,
                    alreadyEnded: false,
                    alreadyStarted: false,
                    endedMinutesAgo: false,
                },
            }
        }

        const { maximumDifferenceInMinutes, minimumDifferenceInMinutes } = computeMvpDifferenceTimers(mvp)

        const variationAlreadyEnded = Number(maximumDifferenceInMinutes) >= 0
        const endedMinutesAgo = Number(maximumDifferenceInMinutes) >= 15

        const variationAboutToStart = Number(minimumDifferenceInMinutes) >= -5
        const variationAlreadyStarted = Number(minimumDifferenceInMinutes) >= 0

        return {
            maximumDifferenceInMinutes,
            minimumDifferenceInMinutes,
            variations: {
                aboutToStart: variationAboutToStart,
                alreadyEnded: variationAlreadyEnded,
                alreadyStarted: variationAlreadyStarted,
                endedMinutesAgo,
            },
        }
    }, [mvp, autoUpdate])

    useEffect(() => {
        const intervalId = setInterval(() => setAutoUpdate((current) => current + 1), 5000)
        return () => clearInterval(intervalId)
    }, [])

    if (!mvp.timeOfDeath) {
        return <TimerContainer $variationProgress={false} $variationStart={false} $variationFinished={false} />
    }

    const mvpDoesNotHaveVariation = mvp.spawnTime.minMinutes === mvp.spawnTime.maxMinutes
    const variationToStartOrAlreadyStarted = variations.aboutToStart || variations.alreadyStarted

    const minimumDate = DateTime.now().setZone(defaultTimeZoneName).minus({ minutes: minimumDifferenceInMinutes })
    const maximumDate = DateTime.now().setZone(defaultTimeZoneName).minus({ minutes: maximumDifferenceInMinutes })

    const localMinimumDate = DateTime.now().minus({ minutes: minimumDifferenceInMinutes })
    const localMaximumDate = DateTime.now().minus({ minutes: maximumDifferenceInMinutes })

    return (
        <TimerContainer
            $variationStart={variations.aboutToStart}
            $variationProgress={variations.alreadyStarted}
            $variationFinished={variations.endedMinutesAgo}
        >
            {!variations.alreadyEnded && (
                <RelativeDateContainer>
                    {mvpDoesNotHaveVariation ? (
                        <Fragment>{Number(minimumDifferenceInMinutes) >= 0 ? 'Spawned' : 'Spawns'}</Fragment>
                    ) : (
                        <Fragment>{Number(minimumDifferenceInMinutes) >= 0 ? 'Started' : 'Starts'}</Fragment>
                    )}

                    <strong
                        title={`Server: ${minimumDate.toLocaleString(DateTime.DATETIME_MED)} / Your: ${localMinimumDate.toLocaleString(DateTime.DATETIME_MED)}`}
                    >
                        {minimumDate.toRelative()}
                    </strong>
                </RelativeDateContainer>
            )}

            {!mvpDoesNotHaveVariation && variationToStartOrAlreadyStarted && (
                <RelativeDateContainer>
                    {Number(maximumDifferenceInMinutes) >= 0 ? 'Finished' : 'Finishes'}
                    <strong
                        title={`Server: ${maximumDate.toLocaleString(DateTime.DATETIME_MED)} / Your: ${localMaximumDate.toLocaleString(DateTime.DATETIME_MED)}`}
                    >
                        {DateTime.now()
                            .setZone(defaultTimeZoneName)
                            .minus({ minutes: maximumDifferenceInMinutes })
                            .toRelative()}
                    </strong>
                </RelativeDateContainer>
            )}
        </TimerContainer>
    )
})
