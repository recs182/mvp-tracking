import { Fragment, type ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import { debounceTime, Subject } from 'rxjs'
import { Button, Flex, IconButton, Tooltip } from '@radix-ui/themes'
import {
    Cross1Icon,
    HamburgerMenuIcon,
    MoonIcon,
    ResetIcon,
    TargetIcon,
    TimerIcon,
    UpdateIcon,
} from '@radix-ui/react-icons'
// app
import { TrackingButton, TrackingInput } from '@/components/TrackingContainer/styles'
import { MvpInformation, TrackingAside, TrackingSpawnTime, UpdateFromTombForm } from '@/components/TrackingContainer'
import { computeTrackingInitialState, sortTrackingMvpList } from '@/helpers/TrackingContainer'
import { defaultDateTimeFormat, defaultTimeZoneName, localStorageMvpsKey } from '@/constants.ts'
// self
import {
    Header,
    HeaderActionsContainer,
    HeaderDisplayDates,
    MvpInformationContainer,
    MvpSprite,
    MvpSpriteContainer,
    SearchContainer,
    TrackerGridCell,
    TrackerGridContainer,
    TrackerGridRow,
    TrackingContainerStyled,
    TrackingOverlay,
    UpdateContainer,
} from './styles'
import { type DispatcherStateModifier, type RagnarokMvp, type TrackingChange, TrackingChangeAction } from './types'

const reducer = (currentState: RagnarokMvp[], beingModified: DispatcherStateModifier) => {
    if (beingModified.fullReset) {
        localStorage.removeItem(localStorageMvpsKey)
        return computeTrackingInitialState()
    }

    const modifiedMvps = [
        { ...beingModified.mvp, timeOfDeath: beingModified.timeOfDeathToUpdate },
        ...currentState.filter((mvp) => mvp.id !== beingModified.mvp.id),
    ]

    // persist the times of death in localStorage in case of refresh
    const toPersistInLocalStorage = modifiedMvps.reduce((merge, mvp) => {
        return mvp.timeOfDeath ? { ...merge, [mvp.id]: mvp.timeOfDeath } : merge
    }, {})
    localStorage.setItem(localStorageMvpsKey, JSON.stringify(toPersistInLocalStorage))

    return modifiedMvps
}

const computeUndoAction = (action: TrackingChangeAction): TrackingChangeAction => {
    if (action === TrackingChangeAction.manualTrack) return TrackingChangeAction.undoManualTrack
    if (action === TrackingChangeAction.track) return TrackingChangeAction.undoTrack
    if (action === TrackingChangeAction.reset) return TrackingChangeAction.undoReset
    return TrackingChangeAction.undo
}

const TrackingContainer = (): ReactElement => {
    const searchSubject = useRef(new Subject<string>()).current
    const searchInputRef = useRef<HTMLInputElement>(null)

    const [searchMvp, setSearchMvp] = useState('')
    const [openAside, setOpenAside] = useState(false)
    const [changesState, setChangesState] = useState<TrackingChange[]>([])
    const [mvpsList, dispatcher] = useReducer(reducer, computeTrackingInitialState())

    const cleanSearchInput = useCallback(() => {
        setSearchMvp('')
        if (searchInputRef.current) {
            searchInputRef.current.value = ''
        }
    }, [searchInputRef])

    const addChangeToHistory = useCallback(
        (change: {
            action: TrackingChangeAction
            mvp: RagnarokMvp
            timeOfDeathFrom: DateTime | null
            timeOfDeathTo: DateTime | null
        }) => {
            setChangesState((currentState) => {
                return [{ ...change, timestamp: DateTime.now().setZone(defaultTimeZoneName) }, ...currentState]
            })
        },
        []
    )

    const realTimeUpdateFactory = (mvp: RagnarokMvp) => () => {
        const updateTime = DateTime.now().setZone(defaultTimeZoneName)
        addChangeToHistory({
            action: TrackingChangeAction.track,
            mvp,
            timeOfDeathFrom: mvp.timeOfDeath,
            timeOfDeathTo: updateTime,
        })
        dispatcher({ mvp, timeOfDeathToUpdate: updateTime })
        cleanSearchInput()
    }

    const fromTombUpdateFactory = useCallback(
        (mvp: RagnarokMvp) => (data: { tombTime: string; confirmedTombTime?: DateTime }) => {
            const [hour, minute] = data.tombTime.split(':').map(Number)

            console.log('data.confirmedTombTime', data.confirmedTombTime)

            const tombTime = data.confirmedTombTime
                ? data.confirmedTombTime
                : DateTime.now().setZone(defaultTimeZoneName).set({ hour, minute, second: 0, millisecond: 0 })

            addChangeToHistory({
                action: TrackingChangeAction.manualTrack,
                mvp,
                timeOfDeathFrom: mvp.timeOfDeath,
                timeOfDeathTo: tombTime,
            })
            dispatcher({ mvp, timeOfDeathToUpdate: tombTime })
            cleanSearchInput()
        },
        []
    )

    const resetTimeFromMvpFactory = useCallback(
        (mvp: RagnarokMvp) => () => {
            addChangeToHistory({
                action: TrackingChangeAction.reset,
                mvp,
                timeOfDeathFrom: mvp.timeOfDeath,
                timeOfDeathTo: null,
            })
            dispatcher({ mvp, timeOfDeathToUpdate: null })
        },
        []
    )

    const undoChangeAndAddToHistory = useCallback(
        (undo: TrackingChange) => () => {
            const actionToUse = computeUndoAction(undo.action)

            addChangeToHistory({
                action: actionToUse,
                mvp: undo.mvp,
                timeOfDeathFrom: null,
                timeOfDeathTo: null,
            })
            dispatcher({ mvp: undo.mvp, timeOfDeathToUpdate: undo.timeOfDeathFrom })
        },
        []
    )

    const toggleAsideOpen = useCallback(() => setOpenAside((current) => !current), [])

    // aside full reset
    const resetChangesState = useCallback(() => {
        setChangesState([])
        dispatcher({
            fullReset: true,
            mvp: {
                id: 0,
                map: '',
                mobId: '',
                name: '',
                spawnTime: {
                    minMinutes: 0,
                    maxMinutes: 0,
                },
                timeOfDeath: null,
            },
            timeOfDeathToUpdate: null,
        })
    }, [])

    useEffect(() => {
        const searchSubscription = searchSubject.pipe(debounceTime(300)).subscribe((search) => {
            setSearchMvp(search)
        })

        return () => {
            searchSubscription.unsubscribe()
        }
    }, [])

    const searchFilteredMvps = mvpsList.filter(
        (mvp) =>
            mvp.name.toLowerCase().includes(searchMvp.toLowerCase()) ||
            mvp.map.toLowerCase().includes(searchMvp.toLowerCase())
    )

    const serverTime = DateTime.now().setZone(defaultTimeZoneName)
    const localTime = DateTime.now()

    return (
        <TrackingContainerStyled>
            <TrackingOverlay $show={openAside} onClick={toggleAsideOpen} title="Toggle menu" />

            <Header>
                <HeaderActionsContainer>
                    <SearchContainer>
                        <label htmlFor="searchMvp">Search for name or map</label>
                        <TrackingInput
                            id="searchMvp"
                            onChange={(changeEvent) => searchSubject.next(changeEvent.target.value)}
                            placeholder="Dark Lord / pay"
                            ref={searchInputRef}
                            style={{ width: 'auto' }}
                            type="text"
                        />
                    </SearchContainer>
                    <IconButton variant="surface" onClick={toggleAsideOpen} style={{ marginTop: '12px' }} title="Menu">
                        <HamburgerMenuIcon />
                    </IconButton>
                </HeaderActionsContainer>
                <HeaderDisplayDates>
                    <div>Server time: {serverTime.toFormat('HH:mm')}</div>
                    <div>Your time: {localTime.toFormat('HH:mm')} </div>
                </HeaderDisplayDates>
            </Header>

            <TrackingAside
                changes={changesState}
                fullTrackerReset={resetChangesState}
                open={openAside}
                toggleOpen={toggleAsideOpen}
                undoChangeFactory={undoChangeAndAddToHistory}
            />

            <TrackerGridContainer>
                <TrackerGridRow $isHeader={true}>
                    <TrackerGridCell>
                        <Flex align="center" gap="2">
                            <TargetIcon /> Mvp information
                        </Flex>
                    </TrackerGridCell>
                    <TrackerGridCell>
                        <Flex align="center" gap="2">
                            <TimerIcon /> Timers
                        </Flex>
                    </TrackerGridCell>
                    <TrackerGridCell>
                        <Flex align="center" gap="2">
                            <UpdateIcon /> Update timers
                        </Flex>
                    </TrackerGridCell>
                </TrackerGridRow>

                {searchFilteredMvps.sort(sortTrackingMvpList).map((mvp) => {
                    const { id, map, mobId, name, spawnTime, sprite, timeOfDeath } = mvp

                    const spriteToUse = sprite ?? 'fallback.png'
                    const trackingChange = changesState
                        .slice(0, 1)
                        .find((history) => history.mvp.id === mvp.id && !history.action.startsWith('UNDO'))

                    return (
                        <TrackerGridRow key={`tracking-row-${id}`}>
                            <TrackerGridCell>
                                <MvpInformationContainer>
                                    <MvpSpriteContainer>
                                        <MvpSprite src={`./mvps/${spriteToUse}`} alt={`${name} sprite`} />
                                    </MvpSpriteContainer>
                                    <MvpInformation map={map} mobId={mobId} name={name} spawnTime={spawnTime} />
                                </MvpInformationContainer>
                            </TrackerGridCell>
                            <TrackerGridCell>
                                <Flex align="center" gap="4">
                                    {timeOfDeath && (
                                        <Fragment>
                                            <Tooltip content={timeOfDeath?.toFormat(defaultDateTimeFormat)}>
                                                <Flex align="center" gap="2">
                                                    <MoonIcon /> {timeOfDeath?.toLocaleString(DateTime.TIME_24_SIMPLE)}
                                                </Flex>
                                            </Tooltip>
                                            <Tooltip content="Remove">
                                                <IconButton
                                                    color="red"
                                                    variant="ghost"
                                                    onClick={resetTimeFromMvpFactory(mvp)}
                                                >
                                                    <Cross1Icon />
                                                </IconButton>
                                            </Tooltip>
                                        </Fragment>
                                    )}

                                    {Boolean(trackingChange) && (
                                        <Tooltip content="Undo">
                                            <Button
                                                color="blue"
                                                variant="ghost"
                                                onClick={undoChangeAndAddToHistory(trackingChange as TrackingChange)}
                                            >
                                                <ResetIcon />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </Flex>
                                <TrackingSpawnTime mvp={mvp} />
                            </TrackerGridCell>
                            <TrackerGridCell>
                                <UpdateContainer>
                                    <TrackingButton onClick={realTimeUpdateFactory(mvp)}>Track</TrackingButton>
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
