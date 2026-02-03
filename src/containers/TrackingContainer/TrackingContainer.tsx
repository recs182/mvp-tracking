import { type ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import mvpsFromJson from '@/assets/mvps.json'
import { DateTime } from 'luxon'
// app
import { InputTombTime, UpdateButton } from '@/components/TrackingContainer/styles'
import { TrackingSpawnTime, UpdateFromTombForm } from '@/components/TrackingContainer'
// self
import {
    MvpNameMapSpawn,
    SearchContainer,
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
import { debounceTime, Subject } from 'rxjs'

const reducer = (
    currentState: RagnarokMvp[],
    beingModified: {
        mvp: RagnarokMvp
        updateTime: DateTime
    }
) => {
    return [
        { ...beingModified.mvp, timeOfDeath: beingModified.updateTime },
        ...currentState.filter((mvp) => mvp.id !== beingModified.mvp.id),
    ]
}

const TrackingContainer = (): ReactElement => {
    const searchSubject = useRef(new Subject<string>()).current

    const [searchMvp, setSearchMvp] = useState('')
    const [ragnarokMvps, dispatcher] = useReducer(reducer, mvpsFromJson as RagnarokMvp[])

    const realTimeUpdateFactory = (mvp: RagnarokMvp) => () => {
        const updateTime = DateTime.now().toUTC()
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
                                        {timeOfDeath && <div>💀 {timeOfDeath?.toFormat('HH:mm')}</div>}
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
