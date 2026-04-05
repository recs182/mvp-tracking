import { useCallback, useEffect, useRef, useState } from 'react'
import { getApps, initializeApp } from 'firebase/app'
import {
    get,
    getDatabase,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    ref,
    remove,
    set,
    type Unsubscribe,
} from 'firebase/database'
import { DateTime } from 'luxon'
import { Subject } from 'rxjs'
// app
import type { RagnarokMvp } from '@/containers/TrackingContainer/types'
import { localStorageRoomCodeKey } from '@/constants'
// self
import { SessionState, type TimerUpdate, type UseFirebaseRealTimeReturn } from './types'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

export const getRoomCode = (): string | null => localStorage.getItem(localStorageRoomCodeKey)

const getFirebaseDb = () => {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    return getDatabase(app)
}

const buildTimersPayload = (mvps: RagnarokMvp[]): Record<string, string> => {
    return mvps.reduce<Record<string, string>>((acc, mvp) => {
        if (mvp.timeOfDeath) {
            acc[mvp.id] = mvp.timeOfDeath.toUTC().toISO()!
        }
        return acc
    }, {})
}

export const useFirebaseRealTime = (): UseFirebaseRealTimeReturn => {
    const [sessionState, setSessionState] = useState<SessionState>(SessionState.idle)
    const roomCodeRef = useRef<string | null>(null)
    const onTimerUpdate$ = useRef(new Subject<TimerUpdate>()).current
    const unsubscribers = useRef<Unsubscribe[]>([])

    const cleanup = useCallback(() => {
        unsubscribers.current.forEach((unsub) => unsub())
        unsubscribers.current = []
        roomCodeRef.current = null
        localStorage.removeItem(localStorageRoomCodeKey)
        setSessionState(SessionState.idle)
    }, [])

    const subscribeToRoom = useCallback(
        (roomCode: string) => {
            const db = getFirebaseDb()
            const timersRef = ref(db, `rooms/${roomCode}/timers`)

            const emit = (id: number, timeOfDeath: string | null) => onTimerUpdate$.next({ id, timeOfDeath })

            unsubscribers.current.push(
                onChildAdded(timersRef, (snap) => emit(Number(snap.key), snap.val() as string)),
                onChildChanged(timersRef, (snap) => emit(Number(snap.key), snap.val() as string)),
                onChildRemoved(timersRef, (snap) => emit(Number(snap.key), null))
            )
        },
        [onTimerUpdate$]
    )

    const connect = useCallback(
        async (roomCode: string, localMvps: RagnarokMvp[], onRoomExists?: () => void): Promise<void> => {
            // Avoid double-connecting
            if (roomCodeRef.current === roomCode) {
                return
            }

            // Tear down any previous session without clearing localStorage yet
            unsubscribers.current.forEach((unsub) => unsub())
            unsubscribers.current = []

            setSessionState(SessionState.connecting)
            roomCodeRef.current = roomCode
            localStorage.setItem(localStorageRoomCodeKey, roomCode)

            const db = getFirebaseDb()
            const snap = await get(ref(db, `rooms/${roomCode}/timers`))

            if (!snap.exists()) {
                // Room does not exist — create it and push local timers
                const payload = buildTimersPayload(localMvps)
                if (Object.keys(payload).length > 0) {
                    await set(ref(db, `rooms/${roomCode}/timers`), payload)
                }
            } else {
                // Room exists — DB is the source of truth, wipe local state first
                onRoomExists?.()
            }

            // Room exists — Firebase is the source of truth, subscribe and receive
            subscribeToRoom(roomCode)
            setSessionState(SessionState.active)
        },
        [subscribeToRoom]
    )

    const broadcastUpdate = useCallback((id: number, timeOfDeath: DateTime | null) => {
        const roomCode = roomCodeRef.current
        if (!roomCode) return

        const db = getFirebaseDb()
        const timerRef = ref(db, `rooms/${roomCode}/timers/${id}`)

        if (timeOfDeath) {
            set(timerRef, timeOfDeath.toUTC().toISO())
        } else {
            remove(timerRef)
        }
    }, [])

    // Cleanup subscriptions on unmount
    useEffect(
        () => () => {
            unsubscribers.current.forEach((unsub) => unsub())
        },
        []
    )

    return {
        sessionState,
        roomCode: roomCodeRef.current,
        connect,
        leaveSession: cleanup,
        broadcastUpdate,
        onTimerUpdate$,
    }
}
