import { type ReactElement, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'

const ICE_SERVERS = {
    iceServers: [
        { urls: ['stun:stun.services.mozilla.com', 'stun:stun.l.google.com:19302', 'stun.cloudflare.com:3478'] },
    ],
}

const RtcTest = (): ReactElement => {
    const peerConnection = useMemo(() => new RTCPeerConnection(ICE_SERVERS), [])

    const sendMessage = useCallback(({ text }: { text: string }) => {
        reset()
    }, [])

    const { handleSubmit, register, reset } = useForm<{ text: string }>({ mode: 'onChange' })

    return (
        <div>
            <form onSubmit={handleSubmit(sendMessage)}>
                <input {...register('text', { required: 'Text is required' })} />
                <button>send</button>
            </form>
        </div>
    )
}

export default RtcTest
