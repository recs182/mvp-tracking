import { type ReactElement, useCallback } from 'react'
import { DateTime } from 'luxon'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Button, IconButton } from '@radix-ui/themes'
// app
import { type TrackingChange } from '@/containers/TrackingContainer/types'
import { TrackingButton } from '@/components/TrackingContainer'
// self
import {
    AsideContentContainer,
    AsideContentHeader,
    AsideContentOverflow,
    ChangeContainer,
    ChangeInformation,
    ChangeInformationContainer,
    ResetAllContainer,
    TrackingAsideStyled,
} from './styles'

export interface TrackingAsideProps {
    changes: TrackingChange[]
    fullTrackerReset: () => void
    open: boolean
    toggleOpen: () => void
    undoChangeFactory: (change: TrackingChange) => () => void
}

export const TrackingAside = ({
    changes,
    fullTrackerReset,
    open,
    toggleOpen,
    undoChangeFactory,
}: TrackingAsideProps): ReactElement => {
    const fullTrackerResetConfirmation = useCallback(() => {
        if (confirm('Are you sure you want to reset the tracker? This will clear all tracked mobs.')) {
            fullTrackerReset()
        }
    }, [fullTrackerReset])

    return (
        <TrackingAsideStyled $open={open}>
            <AsideContentContainer>
                <AsideContentHeader>
                    Changes
                    <IconButton variant="surface" onClick={toggleOpen} title="Menu">
                        <HamburgerMenuIcon />
                    </IconButton>
                </AsideContentHeader>
                <AsideContentOverflow>
                    {changes.map((change, index) => {
                        const actionNumber = String(++index).padStart(2, '0')

                        const canUndo =
                            !change.action.startsWith('UNDO') &&
                            DateTime.now().diff(change.timestamp, 'minutes').minutes < 5

                        return (
                            <ChangeContainer key={`change-${change.mvp.id}-row-${index}`}>
                                <ChangeInformationContainer>
                                    <div>
                                        {actionNumber} - {change.mvp.name}
                                    </div>

                                    <ChangeInformation>
                                        {change.timestamp.toLocaleString(DateTime.TIME_24_SIMPLE)}
                                        <div>{change.action}</div>
                                    </ChangeInformation>
                                </ChangeInformationContainer>

                                {canUndo && <TrackingButton onClick={undoChangeFactory(change)}>Undo</TrackingButton>}
                            </ChangeContainer>
                        )
                    })}

                    {!changes.length && <ChangeContainer>No changes to show yet</ChangeContainer>}
                </AsideContentOverflow>
            </AsideContentContainer>
            <AsideContentContainer style={{ marginTop: 'auto' }}>
                <AsideContentHeader>Danger Zone</AsideContentHeader>
                <ResetAllContainer>
                    <Button color="red" onClick={fullTrackerResetConfirmation}>
                        Full tracker reset
                    </Button>
                </ResetAllContainer>
            </AsideContentContainer>
        </TrackingAsideStyled>
    )
}
