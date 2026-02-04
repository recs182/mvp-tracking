import { DateTime } from 'luxon'

export interface RagnarokMvp {
    id: number
    map: string
    name: string
    spawnTime: { minMinutes: number; maxMinutes: number }
    sprite?: string
    timeOfDeath: DateTime | null
}
