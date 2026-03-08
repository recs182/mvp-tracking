import { defaultTimeZoneName, localStorageTimeZoneKey } from '@/constants'

export const computeTimeZone = () => {
    const storedTimeZone = localStorage.getItem(localStorageTimeZoneKey)
    return storedTimeZone ?? defaultTimeZoneName
}
