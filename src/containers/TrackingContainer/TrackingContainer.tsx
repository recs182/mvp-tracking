import { type ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import mvpsFromJson from '@/assets/mvps.json'
import { DateTime } from 'luxon'
import { debounceTime, Subject } from 'rxjs'
// app
import { InputTombTime, UpdateButton } from '@/components/TrackingContainer/styles'
import { TrackingSpawnTime, UpdateFromTombForm } from '@/components/TrackingContainer'
import { computeMvpDifferenceTimers, getInitialTrackingStateFromLocalStorage } from '@/helpers/TrackingContainer'
// self
import {
    MvpNameMapSpawn,
    ResetButton,
    SearchContainer,
    TimeOfDeathContainer,
    TrackingBody,
    TrackingCell,
    TrackingContainerStyled,
    TrackingHeader,
    TrackingHeaderCell,
    TrackingRow,
    TrackingTable,
    TrackingTableResponsive,
    UpdateContainer,
} from './styles'
import type { RagnarokMvp } from './types'
import { localStorageMvpsKey } from '@/constants.ts'

const reducer = (
    currentState: RagnarokMvp[],
    beingModified: {
        mvp: RagnarokMvp
        updateTime: DateTime | null
    }
) => {
    const modifiedMvps = [
        { ...beingModified.mvp, timeOfDeath: beingModified.updateTime },
        ...currentState.filter((mvp) => mvp.id !== beingModified.mvp.id),
    ]

    const sortedMvps = modifiedMvps.sort((a, b) => {
        const aHasTime = Boolean(a.timeOfDeath)
        const bHasTime = Boolean(b.timeOfDeath)

        // 1) timeOfDeath first
        if (aHasTime !== bHasTime) return aHasTime ? -1 : 1

        // 2) if both have timeOfDeath, closest "difference" to 0 first
        if (aHasTime && bHasTime) {
            const { minimumDifferenceInMinutes: aDiff } = computeMvpDifferenceTimers(a)
            const { minimumDifferenceInMinutes: bDiff } = computeMvpDifferenceTimers(b)

            const aScore = Math.abs(Number(aDiff))
            const bScore = Math.abs(Number(bDiff))

            if (aScore !== bScore) return aScore - bScore
        }

        // 3) fallback: alphabetical
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })

    localStorage.setItem(localStorageMvpsKey, JSON.stringify(sortedMvps))
    return sortedMvps
}

const TrackingContainer = (): ReactElement => {
    const searchSubject = useRef(new Subject<string>()).current

    const [searchMvp, setSearchMvp] = useState('')

    const initialStateFromLocalStorage = getInitialTrackingStateFromLocalStorage()

    const [ragnarokMvps, dispatcher] = useReducer(
        reducer,
        initialStateFromLocalStorage ?? (mvpsFromJson as RagnarokMvp[])
    )

    const realTimeUpdateFactory = (mvp: RagnarokMvp) => () => {
        const updateTime = DateTime.now().setZone('Europe/London')
        dispatcher({ mvp, updateTime: updateTime })
    }

    const fromTombUpdateFactory = useCallback(
        (mvp: RagnarokMvp) => (data: { tombTime: string }) => {
            const [hour, minute] = data.tombTime.split(':').map(Number)

            const tombTime = DateTime.now().set({ hour, minute, second: 0, millisecond: 0 })
            dispatcher({ mvp, updateTime: tombTime })
        },
        []
    )

    const resetTimeFromMvpFactory = useCallback(
        (mvp: RagnarokMvp) => () => {
            dispatcher({ mvp, updateTime: null })
        },
        []
    )

    useEffect(() => {
        const searchSubscription = searchSubject.pipe(debounceTime(300)).subscribe((search) => {
            setSearchMvp(search)
        })

        return () => {
            searchSubscription.unsubscribe()
        }
    }, [])

    const searchFilteredMvps = ragnarokMvps.filter(
        (mvp) =>
            mvp.name.toLowerCase().includes(searchMvp.toLowerCase()) ||
            mvp.map.toLowerCase().includes(searchMvp.toLowerCase())
    )

    return (
        <TrackingContainerStyled>
            <TrackingTableResponsive>
                <TrackingTable>
                    <TrackingHeader>
                        <TrackingRow>
                            <TrackingHeaderCell>
                                <SearchContainer>
                                    <label htmlFor="searchMvp">Search for name or map</label>
                                    <InputTombTime
                                        id="searchMvp"
                                        onChange={(changeEvent) => searchSubject.next(changeEvent.target.value)}
                                        placeholder="Dark Lord"
                                        style={{ width: '180px' }}
                                        type="text"
                                    />
                                </SearchContainer>
                            </TrackingHeaderCell>
                            <TrackingHeaderCell>⏳ Timers</TrackingHeaderCell>
                            <TrackingHeaderCell>🔃 Update</TrackingHeaderCell>
                        </TrackingRow>
                    </TrackingHeader>
                    <TrackingBody>
                        {searchFilteredMvps.map((mvp) => {
                            const { id, name, map, spawnTime, timeOfDeath } = mvp

                            return (
                                <TrackingRow key={id}>
                                    <TrackingCell>
                                        <MvpNameMapSpawn>
                                            <div>{name}</div>
                                            <div>
                                                Map: <strong>{map}</strong>
                                            </div>
                                            <div>
                                                Spawn time:{' '}
                                                <strong>
                                                    {spawnTime.minMinutes}~{spawnTime.maxMinutes}
                                                </strong>
                                            </div>
                                        </MvpNameMapSpawn>
                                    </TrackingCell>
                                    <TrackingCell>
                                        {timeOfDeath && (
                                            <TimeOfDeathContainer>
                                                💀 {timeOfDeath?.toFormat('HH:mm')}
                                                <ResetButton onClick={resetTimeFromMvpFactory(mvp)} title="Reset">
                                                    ❌
                                                </ResetButton>
                                            </TimeOfDeathContainer>
                                        )}
                                        <TrackingSpawnTime mvp={mvp} />
                                    </TrackingCell>
                                    <TrackingCell>
                                        <UpdateContainer>
                                            <UpdateButton onClick={realTimeUpdateFactory(mvp)}>Update</UpdateButton>
                                            <div style={{ padding: '0.25rem' }}>or</div>
                                            <UpdateFromTombForm updateFromTomb={fromTombUpdateFactory(mvp)} />
                                        </UpdateContainer>
                                    </TrackingCell>
                                </TrackingRow>
                            )
                        })}
                        {!searchFilteredMvps.length && (
                            <TrackingRow>
                                <TrackingCell rowSpan={3}>Nothing found search for {searchMvp}...</TrackingCell>
                            </TrackingRow>
                        )}
                    </TrackingBody>
                </TrackingTable>
            </TrackingTableResponsive>
        </TrackingContainerStyled>
    )
}

export default TrackingContainer
