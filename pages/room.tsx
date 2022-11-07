import { useMutation, useSubscription, } from '@apollo/client';
import Head from 'next/head'
import { useEffect, useState, VideoHTMLAttributes, useRef } from 'react';
import AudioComponent from '../component/video';
import { useRoom } from '../contexts/room';
import { CONNECT_SUBSCRIPTION, SEND_ANSWER_MUTATION, SEND_ICE_CANDIDATE_MUTATION, STREAM_CONNECT_MUTATION, STREAM_MUTATION } from '../graphql';


type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream
}


export default function Home() {

  const refVideo = useRef<HTMLVideoElement>(null)

  const { roomId, memberId } = useRoom();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>()
  const [localStream, setLocalStream] = useState<MediaStream>()
  const [remoteStream1, setRemoteStream1] = useState<MediaStream>()
  const [remoteStream2, setRemoteStream2] = useState<MediaStream>()
  const [remoteStream3, setRemoteStream3] = useState<MediaStream>()
  const [remoteStream4, setRemoteStream4] = useState<MediaStream>()
  const [remoteStream5, setRemoteStream5] = useState<MediaStream>()
  const [remoteStream, setRemoteStream] = useState<MediaStream[]>([])
  let remoteStreams: MediaStream[] = [
  ];
  let counts = 0;
  const [streamConnectStatus, setStreamConnectStatus] = useState(false);

  const [streamCreate, streamData] = useMutation(
    STREAM_MUTATION,
  );

  const [sendIceCandidate, sendIceCandidateData] = useMutation(
    SEND_ICE_CANDIDATE_MUTATION,
  );

  const [streamConnectCreate, streamConnectData] = useMutation(
    STREAM_CONNECT_MUTATION,
  );


  const [sendAnswer, sendAnswerData] = useMutation(
    SEND_ANSWER_MUTATION,
  );

  const { data, loading, error } = useSubscription(
    CONNECT_SUBSCRIPTION,
    {
      variables: {
        "input": {
          "roomId": roomId,
          "memberId": memberId,
        }
      }
    }
  );


  useEffect(() => {
    if (data) {
      if (data.streamConnection.offer !== null) {
        setupOffer({
          sdp: data.streamConnection.offer.SDP,
          type: data.streamConnection.offer.Type
        })
      }

      if (data.streamConnection.iceCandidate !== null) {
        saveIceCandidate({
          candidate: data.streamConnection.iceCandidate.candidate,
          sdpMLineIndex: data.streamConnection.iceCandidate.sdpMLineIndex,
          sdpMid: data.streamConnection.iceCandidate.sdpMid,
        })
      }
    }
  }, [data])




  useEffect(() => {
    const servers = {
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302'],
      },],
      iceCandidatePoolSize: 10,
    };

    const pc = new RTCPeerConnection(servers);

    setPeerConnection(pc);
    pc.addEventListener('icecandidate', async (event) => {
      if (event.candidate) {
        let data = await sendIceCandidate({
          variables: {
            "input": {
              "iceCandidate": {
                "sdpMLineIndex": event.candidate.toJSON().sdpMLineIndex,
                "sdpMid": event.candidate.toJSON().sdpMid,
                "candidate": event.candidate.toJSON().candidate
              },
              "memberId": memberId,
            }
          }
        });
        console.log("sendIceCandidate", data)
      }
    });

    pc.addEventListener('connectionstatechange', (event) => {
      console.log("connectionstatechange", event)
    });

    pc.addEventListener('iceconnectionstatechange', (event) => {
      console.log("iceconnectionstatechange", event)
    });

    setupAudioStream(pc);
  }, [])


  const setupAudioStream = async (peerConnection: RTCPeerConnection) => {

    let localVideo = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

    // Push tracks from local stream to peer connection
    localVideo.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localVideo);
    });

    // setLocalStream(localVideo)

    peerConnection.ontrack = (event) => {
      console.log("streams", event.streams);
      console.log("streams length", event.streams.length);

      remoteStreams.push(event.streams[0]);

      if (remoteStreams.length === 2) {
        let stream1 = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          stream1.addTrack(track);
        });
        console.log("stream", stream1);
        setRemoteStream1(stream1);
      }

      if (remoteStreams.length === 3) {
        let stream2 = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          console.log("track", track);
          stream2.addTrack(track);
        });
        console.log("stream2", stream2);
        setRemoteStream2(stream2);
      }

      if (remoteStreams.length === 4) {
        let stream3 = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          console.log("track", track);
          stream3.addTrack(track);
        });
        console.log("stream3", stream3);
        setRemoteStream3(stream3);
      }

      if (remoteStreams.length === 5) {
        let stream4 = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          console.log("track", track);
          stream4.addTrack(track);
        });
        console.log("stream4", stream4);
        setRemoteStream4(stream4);
      }

      if (remoteStreams.length === 6) {
        let stream5 = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          console.log("track", track);
          stream5.addTrack(track);
        });
        console.log("stream5", stream5);
        setRemoteStream5(stream5);
      }

      setRemoteStream(remoteStreams);

      // event.streams[0].getTracks().forEach((track) => {
      //     console.log("track", track)
      //     remoteStream.addTrack(track);
      // });
    };
  }


  const setupOffer = async ({ sdp, type }: { sdp: string, type: RTCSdpType }) => {
    try {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription({
          sdp: sdp,
          type: type
        }));

        const answerDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDescription);

        let data = await sendAnswer({
          variables: {
            "input": {
              answer: {
                SDP: answerDescription.sdp,
                Type: answerDescription.type
              },
              memberId: memberId,
            }
          }
        });
        console.log("sendAnswer", data)
      }
    } catch (e) {
      console.error("add ice candidate", e);
    }
  }

  const saveIceCandidate = async ({ candidate, sdpMLineIndex, sdpMid }: { candidate: string, sdpMLineIndex: number, sdpMid: string }) => {
    if (peerConnection) {
      try {
        let iceCandidate = new RTCIceCandidate({
          candidate,
          sdpMLineIndex,
          sdpMid,
        });
        await peerConnection.addIceCandidate(iceCandidate);
      } catch (e) {
        console.error("add ice candidate", e);
      }
    }
  }

  if (peerConnection === null) return <div>Loading...</div>
  else
    return (
      <div className="w-screen h-screen">
        <Head>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='h-full w-full'>
          {/* 
          <div className='w-[50%] h-[42%] rounded mx-[25%] mt-10  overflow-hidden'>
            <video autoPlay playsInline id="localVideo" ref={refVideo} />
            {localStream && <AudioComponent srcObject={localStream} autoPlay playsInline className='h-full w-full rounded overflow-hidden' />}
          </div> */}

          <div className='w-full flex justify-center mt-10 gap-x-10' >
            <button
              className='bg-white p-2 px-6 text-black rounded-md w-[30%]'
              onClick={async () => {
                try {
                  let data = await streamCreate(
                    {
                      variables: {
                        "input": {
                          "roomId": roomId
                        }
                      }
                    }
                  );
                  console.log(data!.data!.streamCreate);
                  setStreamConnectStatus(data!.data!.streamCreate);
                } catch (e) {
                  console.log(e);
                }
              }}>
              Create Stream
            </button>
            <button
              className='bg-white p-2 px-6 text-black rounded-md w-[30%]'
              onClick={async () => {

                await streamConnectCreate(
                  {
                    variables: {
                      "input": {
                        "memberId": memberId,
                      }
                    }
                  });
              }}>
              Connect to stream
            </button>
          </div>

          <div className='w-full flex gap-x-10 gap-y-5 mt-10 justify-center  flex-wrap px-32'>
            {/* {remoteStream?.length}
            {remoteStream && remoteStream.map((data, index) => {
              return <div className='h-[100px] w-[130px] overflow-hidden rounded ' key={index}>
                {data && <AudioComponent srcObject={data} autoPlay playsInline controls className='w-full h-full' />}
              </div>
            })
            } */}
            <div className='h-[50px] w-[250px] overflow-hidden rounded bg-white' >
              {remoteStream1 && <AudioComponent srcObject={remoteStream1} autoPlay controls className='w-full h-full' />}
            </div>

            <div className='h-[50px] w-[250px] overflow-hidden rounded bg-white' >
              {remoteStream2 && <AudioComponent srcObject={remoteStream2} autoPlay controls className='w-full h-full' />}
            </div>
            <div className='h-[50px] w-[250px] overflow-hidden rounded bg-white' >
              {remoteStream3 && <AudioComponent srcObject={remoteStream3} autoPlay controls className='w-full h-full' />}
            </div>

            <div className='h-[50px] w-[250px] overflow-hidden rounded bg-white' >
              {remoteStream4 && <AudioComponent srcObject={remoteStream4} autoPlay controls className='w-full h-full' />}
            </div>
            <div className='h-[50px] w-[250px] overflow-hidden rounded bg-white' >
              {remoteStream5 && <AudioComponent srcObject={remoteStream5} autoPlay controls className='w-full h-full' />}
            </div>
          </div>
          {/* <h4>New comment: {!loading && data}</h4> */}
        </main >

      </div >
    )
}
