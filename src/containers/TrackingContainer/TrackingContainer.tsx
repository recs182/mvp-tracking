import { Fragment, type ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import { debounceTime, Subject } from 'rxjs'
// app
import { InputTombTime, UpdateButton } from '@/components/TrackingContainer/styles'
import { MvpInformation, TrackingSpawnTime, UpdateFromTombForm } from '@/components/TrackingContainer'
import { computeTrackingInitialState, sortTrackingMvpList } from '@/helpers/TrackingContainer'
import { defaultTimeZoneName, localStorageMvpsKey } from '@/constants.ts'
// self
import {
    ActionButton,
    Header,
    HeaderDisplayDates,
    MvpInformationContainer,
    MvpSprite,
    MvpSpriteContainer,
    SearchContainer,
    TimeOfDeathContainer,
    TrackerGridCell,
    TrackerGridContainer,
    TrackerGridRow,
    TrackingContainerStyled,
    UpdateContainer,
} from './styles'
import type { RagnarokMvp } from './types'

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

    // persist the times of death in localStorage in case of refresh
    const toPersistInLocalStorage = modifiedMvps.reduce((merge, mvp) => {
        return mvp.timeOfDeath ? { ...merge, [mvp.id]: mvp.timeOfDeath } : merge
    }, {})
    localStorage.setItem(localStorageMvpsKey, JSON.stringify(toPersistInLocalStorage))

    return modifiedMvps
}

const TrackingContainer = (): ReactElement => {
    const searchSubject = useRef(new Subject<string>()).current
    const searchInputRef = useRef<HTMLInputElement>(null)

    const [searchMvp, setSearchMvp] = useState('')
    const [undoState, setUndoState] = useState<[number, DateTime | null][]>([])

    const [ragnarokMvps, dispatcher] = useReducer(reducer, computeTrackingInitialState())

    const cleanSearchInput = useCallback(() => {
        setSearchMvp('')
        if (searchInputRef.current) {
            searchInputRef.current.value = ''
        }
    }, [searchInputRef])

    const addActionToUndoState = useCallback((id: number, timeOfDeath: DateTime | null) => {
        setUndoState((currentState) => {
            return [[id, timeOfDeath] as [number, DateTime], ...currentState].slice(0, 5)
        })
    }, [])

    const realTimeUpdateFactory = (mvp: RagnarokMvp) => () => {
        const updateTime = DateTime.now().setZone(defaultTimeZoneName)

        if (mvp.timeOfDeath || !updateTime) {
            addActionToUndoState(mvp.id, mvp.timeOfDeath)
        }

        dispatcher({ mvp, updateTime })
        cleanSearchInput()
    }

    const fromTombUpdateFactory = useCallback(
        (mvp: RagnarokMvp) => (data: { tombTime: string }) => {
            const [hour, minute] = data.tombTime.split(':').map(Number)

            const tombTime = DateTime.now()
                .setZone(defaultTimeZoneName)
                .set({ hour, minute, second: 0, millisecond: 0 })

            dispatcher({ mvp, updateTime: tombTime })
            cleanSearchInput()
        },
        []
    )

    const resetTimeFromMvpFactory = useCallback(
        (mvp: RagnarokMvp) => () => {
            if (mvp.timeOfDeath) {
                addActionToUndoState(mvp.id, mvp.timeOfDeath)
            }

            dispatcher({ mvp, updateTime: null })
        },
        []
    )

    const undoActionFactory = useCallback(
        (mvp: RagnarokMvp) => () => {
            setUndoState((currentState) => {
                const [_, timeOfDeath] = currentState[0]

                // update regardless if it is null or actual date
                dispatcher({ mvp, updateTime: timeOfDeath })

                return currentState.slice(1)
            })
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
                        style={{ width: 'auto' }}
                        type="text"
                    />
                </SearchContainer>
                <HeaderDisplayDates>
                    <div>Server time: {serverTime.toFormat('HH:mm')}</div>
                    <div>Your time: {localTime.toFormat('HH:mm')} </div>
                </HeaderDisplayDates>
            </Header>

            <TrackerGridContainer>
                <TrackerGridRow $isHeader={true}>
                    <TrackerGridCell>🐉 Mvp information</TrackerGridCell>
                    <TrackerGridCell>⏳ Timers</TrackerGridCell>
                    <TrackerGridCell>🔃 Update timers</TrackerGridCell>
                </TrackerGridRow>

                {searchFilteredMvps.sort(sortTrackingMvpList).map((mvp) => {
                    const { id, map, mobId, name, spawnTime, sprite, timeOfDeath } = mvp

                    const spriteToUse = sprite ?? 'fallback.png'
                    const hasActionToUndo = Array.isArray(undoState.find((tuple) => tuple[0] === mvp.id))

                    return (
                        <TrackerGridRow key={id}>
                            <TrackerGridCell>
                                <MvpInformationContainer>
                                    <MvpSpriteContainer>
                                        <MvpSprite src={`./mvps/${spriteToUse}`} alt={`${name} sprite`} />
                                    </MvpSpriteContainer>
                                    <MvpInformation map={map} mobId={mobId} name={name} spawnTime={spawnTime} />
                                </MvpInformationContainer>
                            </TrackerGridCell>
                            <TrackerGridCell>
                                <TimeOfDeathContainer>
                                    {timeOfDeath && (
                                        <Fragment>
                                            💀 {timeOfDeath?.toFormat('HH:mm')}
                                            <ActionButton onClick={resetTimeFromMvpFactory(mvp)} title="Remove">
                                                ❌
                                            </ActionButton>
                                        </Fragment>
                                    )}
                                    {hasActionToUndo && (
                                        <ActionButton onClick={undoActionFactory(mvp)} title="Undo">
                                            ◀️
                                        </ActionButton>
                                    )}
                                </TimeOfDeathContainer>
                                <TrackingSpawnTime mvp={mvp} />
                            </TrackerGridCell>
                            <TrackerGridCell>
                                <UpdateContainer>
                                    <UpdateButton onClick={realTimeUpdateFactory(mvp)}>Track</UpdateButton>
                                    <div style={{ padding: '0.25rem' }}>or</div>
                                    <UpdateFromTombForm updateFromTomb={fromTombUpdateFactory(mvp)} />
                                </UpdateContainer>
                            </TrackerGridCell>
                        </TrackerGridRow>
                    )
                })}

                {!searchFilteredMvps.length && (
                    <TrackerGridRow style={{ gridTemplateColumns: '1fr' }}>
                        <TrackerGridCell>
                            Nothing found when searching for <strong>{searchMvp}</strong> 😞
                        </TrackerGridCell>
                    </TrackerGridRow>
                )}
            </TrackerGridContainer>
        </TrackingContainerStyled>
    )
}

export default TrackingContainer
