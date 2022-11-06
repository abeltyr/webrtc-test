import { gql } from '@apollo/client';

export const CONNECT_SUBSCRIPTION = gql`
  subscription Connect($input: StreamConnectionInput!) {
    streamConnection(input: $input) {
      iceCandidate {
        candidate
        sdpMid
        sdpMLineIndex
      }
      offer {
        SDP
        Type
      }
    }
  }
`;


export const STREAM_MUTATION = gql`
  mutation StreamCreate($input: streamCreateInput) {
    streamCreate(input: $input)
  }
`;

export const STREAM_CONNECT_MUTATION = gql`
  mutation StreamConnect($input: StreamMemberConnectInput) {
    streamMemberConnect(input: $input)
  }
`;

export const SEND_ANSWER_MUTATION = gql`
  mutation StreamSendAnswer($input: StreamSendAnswerInput) {
    streamMemberSendAnswer(input: $input)
  }
`;

export const SEND_ICE_CANDIDATE_MUTATION = gql`
  mutation StreamMemberSendIceCandidate($input: StreamSendIceCandidateInput) {
    streamMemberSendIceCandidate(input: $input)
  }
`;
