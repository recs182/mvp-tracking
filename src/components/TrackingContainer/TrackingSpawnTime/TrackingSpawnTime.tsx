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
    variationAboutToStart: boolean
    variationAlreadyStarted: boolean
}

export const TrackingSpawnTime = memo<TrackingSpawnTimeProps>(({ mvp }): ReactElement => {
    const [autoUpdate, setAutoUpdate] = useState<number>(0)

    const { variationAboutToStart, variationAlreadyStarted, maximumDifferenceInMinutes, minimumDifferenceInMinutes } =
        useMemo<MemoReturn>(() => {
            const dateUTC = DateTime.now().setZone(defaultTimeZoneName)

            if (!mvp.timeOfDeath) {
                return {
                    variationAboutToStart: false,
                    variationAlreadyStarted: false,
                    maximumSpawnTime: dateUTC,
                    minimalSpawnTime: dateUTC,
                }
            }

            const { maximumDifferenceInMinutes, minimumDifferenceInMinutes } = computeMvpDifferenceTimers(mvp)

            const variationAboutToStart = Number(minimumDifferenceInMinutes) >= -5
            const variationAlreadyStarted = Number(minimumDifferenceInMinutes) >= 0

            return {
                variationAboutToStart,
                variationAlreadyStarted,
                maximumDifferenceInMinutes,
                minimumDifferenceInMinutes,
            }
        }, [mvp, autoUpdate])

    useEffect(() => {
        const intervalId = setInterval(() => setAutoUpdate((current) => current + 1), 5000)
        return () => clearInterval(intervalId)
    }, [])

    if (!mvp.timeOfDeath) {
        return <TimerContainer $alreadyInVariation={false} $variation={false} />
    }

    const mvpDoesNotHaveVariation = mvp.spawnTime.minMinutes === mvp.spawnTime.maxMinutes
    const variationToStartOrAlreadyStarted = variationAboutToStart || variationAlreadyStarted

    const minimumDate = DateTime.now().setZone(defaultTimeZoneName).minus({ minutes: minimumDifferenceInMinutes })
    const maximumDate = DateTime.now().setZone(defaultTimeZoneName).minus({ minutes: maximumDifferenceInMinutes })

    const localMinimumDate = DateTime.now().minus({ minutes: minimumDifferenceInMinutes })
    const localMaximumDate = DateTime.now().minus({ minutes: maximumDifferenceInMinutes })

    return (
        <TimerContainer $alreadyInVariation={variationAlreadyStarted} $variation={variationAboutToStart}>
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
