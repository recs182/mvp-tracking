import { type ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import { debounceTime, Subject } from 'rxjs'
// app
import mvpsFromJson from '@/assets/mvps.json'
import { InputTombTime, UpdateButton } from '@/components/TrackingContainer/styles'
import { MvpInformation, TrackingSpawnTime, UpdateFromTombForm } from '@/components/TrackingContainer'
import { computeTrackingInitialState, sortTrackingMvpList } from '@/helpers/TrackingContainer'
// self
import {
    Header,
    HeaderDisplayDates,
    MvpSprite,
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
import { defaultTimeZoneName, localStorageMvpsKey } from '@/constants.ts'

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

    localStorage.setItem(
        localStorageMvpsKey,
        JSON.stringify(
            modifiedMvps.reduce((merge, mvp) => {
                return mvp.timeOfDeath ? { ...merge, [mvp.id]: mvp.timeOfDeath } : merge
            }, {})
        )
    )
    return modifiedMvps
}

const TrackingContainer = (): ReactElement => {
    const searchSubject = useRef(new Subject<string>()).current

    const searchInputRef = useRef<HTMLInputElement>(null)
    const [searchMvp, setSearchMvp] = useState('')

    const initialStateFromLocalStorage = computeTrackingInitialState()

    const [ragnarokMvps, dispatcher] = useReducer(
        reducer,
        initialStateFromLocalStorage ?? (mvpsFromJson as RagnarokMvp[])
    )

    const cleanSearchInput = useCallback(() => {
        setSearchMvp('')
        if (searchInputRef.current) {
            searchInputRef.current.value = ''
        }
    }, [searchInputRef])

    const realTimeUpdateFactory = (mvp: RagnarokMvp) => () => {
        const updateTime = DateTime.now().setZone(defaultTimeZoneName)
        dispatcher({ mvp, updateTime: updateTime })
        cleanSearchInput()
    }

    const fromTombUpdateFactory = useCallback(
        (mvp: RagnarokMvp) => (data: { tombTime: string }) => {
            const [hour, minute] = data.tombTime.split(':').map(Number)

            console.log('hour, minute', hour, minute)

            const tombTime = DateTime.now()
                .setZone(defaultTimeZoneName)
                .set({ hour, minute, second: 0, millisecond: 0 })

            console.log('tombTime', tombTime, tombTime.toLocaleString(DateTime.DATETIME_MED))

            dispatcher({ mvp, updateTime: tombTime })
            cleanSearchInput()
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

    const serverTime = DateTime.now().setZone(defaultTimeZoneName)
    const localTime = DateTime.now()

    return (
        <TrackingContainerStyled>
            <Header>
                <SearchContainer>
                    <label htmlFor="searchMvp">Search for name or map</label>
                    <InputTombTime
                        id="searchMvp"
                        onChange={(changeEvent) => searchSubject.next(changeEvent.target.value)}
                        placeholder="Dark Lord / pay"
                        ref={searchInputRef}
                        style={{ width: '340px' }}
                        type="text"
                    />
                </SearchContainer>
                <HeaderDisplayDates>
                    <div>Server time: {serverTime.toFormat('HH:mm')}</div>
                    <div>Your time: {localTime.toFormat('HH:mm')} </div>
                </HeaderDisplayDates>
            </Header>

            <TrackingTableResponsive>
                <TrackingTable>
                    <TrackingHeader>
                        <TrackingRow>
                            <TrackingHeaderCell colSpan={2}>🐉 Mvp</TrackingHeaderCell>
                            <TrackingHeaderCell>⏳ Timers</TrackingHeaderCell>
                            <TrackingHeaderCell>🔃 Auto or manually from tomb</TrackingHeaderCell>
                        </TrackingRow>
                    </TrackingHeader>
                    <TrackingBody>
                        {searchFilteredMvps.sort(sortTrackingMvpList).map((mvp) => {
                            const { id, name, map, spawnTime, sprite, timeOfDeath } = mvp

                            const spriteToUse = sprite ?? 'fallback.png'

                            return (
                                <TrackingRow key={id}>
                                    <TrackingCell style={{ width: 32 }}>
                                        <MvpSprite src={`./mvps/${spriteToUse}`} alt={`${name} sprite`} />
                                    </TrackingCell>
                                    <TrackingCell>
                                        <MvpInformation map={map} name={name} spawnTime={spawnTime} />
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
                                <TrackingCell
                                    style={{ width: 726, textAlign: 'center', padding: '5rem 0.5rem' }}
                                    colSpan={4}
                                >
                                    Nothing found when searching for <strong>{searchMvp}</strong> 😞
                                </TrackingCell>
                            </TrackingRow>
                        )}
                    </TrackingBody>
                </TrackingTable>
            </TrackingTableResponsive>
        </TrackingContainerStyled>
    )
}

export default TrackingContainer
