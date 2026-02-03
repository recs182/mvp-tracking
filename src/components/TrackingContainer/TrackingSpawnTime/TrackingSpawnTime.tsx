import { memo, type ReactElement, useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
// app
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'
import { RelativeDateContainer, TimerContainer } from '@/components/TrackingContainer/TrackingSpawnTime/styles.ts'

interface TrackingSpawnTimeProps {
    mvp: RagnarokMvp
}

type MemoReturn = {
    maximumDifferenceInMinutes?: number
    maximumSpawnTime: DateTime
    minimalSpawnTime: DateTime
    minimumDifferenceInMinutes?: number
    variationAboutToStart: boolean
    variationAlreadyStarted: boolean
}

export const TrackingSpawnTime = memo<TrackingSpawnTimeProps>(({ mvp }): ReactElement => {
    const [autoUpdate, setAutoUpdate] = useState<number>(0)

    const { variationAboutToStart, variationAlreadyStarted, maximumDifferenceInMinutes, minimumDifferenceInMinutes } =
        useMemo<MemoReturn>(() => {
            const { spawnTime, timeOfDeath } = mvp
            const dateUTC = DateTime.now().toUTC()

            if (!timeOfDeath) {
                return {
                    variationAboutToStart: false,
                    variationAlreadyStarted: false,
                    maximumSpawnTime: dateUTC,
                    minimalSpawnTime: dateUTC,
                }
            }

            const maximumSpawnTime = timeOfDeath.plus({ minutes: spawnTime.maxMinutes })
            const maximumDifferenceInMinutes = dateUTC.diff(maximumSpawnTime, ['minutes']).toObject().minutes

            const minimalSpawnTime = timeOfDeath.plus({ minutes: spawnTime.minMinutes })
            const minimumDifferenceInMinutes = dateUTC.diff(minimalSpawnTime, ['minutes']).toObject().minutes

            const variationAboutToStart = Number(minimumDifferenceInMinutes) >= -5
            const variationAlreadyStarted = Number(minimumDifferenceInMinutes) >= 0

            return {
                variationAboutToStart,
                variationAlreadyStarted,
                maximumDifferenceInMinutes,
                maximumSpawnTime,
                minimalSpawnTime,
                minimumDifferenceInMinutes,
            }
        }, [mvp, autoUpdate])

    useEffect(() => {
        const intervalId = setInterval(() => setAutoUpdate((current) => current + 1), 1000 * 20)
        return () => clearInterval(intervalId)
    }, [])

    if (!mvp.timeOfDeath) {
        return <TimerContainer $alreadyInVariation={false} $variation={false} />
    }

    const mvpDoesNotHaveVariation = mvp.spawnTime.minMinutes === mvp.spawnTime.maxMinutes
    const variationToStartOrAlreadyStarted = variationAboutToStart || variationAlreadyStarted

    return (
        <TimerContainer
            $alreadyInVariation={!mvpDoesNotHaveVariation && variationAlreadyStarted}
            $variation={!mvpDoesNotHaveVariation && variationAboutToStart}
        >
            <RelativeDateContainer>
                {mvpDoesNotHaveVariation ? 'Spawns' : Number(maximumDifferenceInMinutes) > 0 ? 'Started' : 'Starts'}

                <strong>{DateTime.now().toUTC().minus({ minutes: minimumDifferenceInMinutes }).toRelative()}</strong>
            </RelativeDateContainer>

            {!mvpDoesNotHaveVariation && variationToStartOrAlreadyStarted && (
                <RelativeDateContainer>
                    {Number(maximumDifferenceInMinutes) > 0 ? 'Finished' : 'Finishes'}
                    <strong>
                        {DateTime.now().toUTC().minus({ minutes: maximumDifferenceInMinutes }).toRelative()}
                    </strong>
                </RelativeDateContainer>
            )}
        </TimerContainer>
    )
})
