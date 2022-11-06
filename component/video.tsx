import { AudioHTMLAttributes, useEffect, useRef } from 'react'

type PropsType = AudioHTMLAttributes<HTMLAudioElement> & {
    srcObject: MediaStream
}

export default function AudioComponent({ srcObject, ...props }: PropsType) {
    const refAudio = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (!refAudio.current) return
        let stream =
            new MediaStream();

        srcObject.getTracks().forEach((track) => {
            stream.addTrack(track);
        });
        refAudio.current.srcObject = stream
    }, [srcObject])

    return <audio ref={refAudio} {...props} />
}