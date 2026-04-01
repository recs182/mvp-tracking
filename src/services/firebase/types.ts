import type { DateTime } from 'luxon'
import { Subject } from 'rxjs'
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'

export enum SessionState {
    idle = 'idle',
    connecting = 'connecting',
    active = 'active',
}

export type TimerUpdate = { id: number; timeOfDeath: string | null }

export interface UseFirebaseRealTimeReturn {
    sessionState: SessionState
    roomCode: string | null
    // join or create a room; pass current local mvps so they are pushed when creating
    connect: (roomCode: string, localMvps: RagnarokMvp[]) => Promise<void>
    leaveSession: () => void
    broadcastUpdate: (id: number, timeOfDeath: DateTime | null) => void
    // emits every time a single timer changes in Firebase (including removals → null)
    onTimerUpdate$: Subject<TimerUpdate>
}
