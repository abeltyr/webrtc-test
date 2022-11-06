import React, { useContext, useState } from "react";
const initialValues: {
    roomId: string,
    updateRoomId: Function
    memberId: string,
    updateMemberId: Function
} = {
    roomId: "",
    updateRoomId: () => { },
    memberId: "",
    updateMemberId: () => { },
};

type Props = {
    children?: React.ReactNode;
};

const RoomContext = React.createContext(initialValues);


const useRoom = () => useContext(RoomContext);

const RoomProvider: React.FC<Props> = ({ children }) => {
    const [roomId, updateRoomId] = useState<string>("cl9zpex2j0000lpoi1kjiqr6f");
    const [memberId, updateMemberId] = useState<string>("cl9zpex3o0013lpoi18mwu9d7");

    return (
        <RoomContext.Provider value={{
            roomId,
            memberId,
            updateRoomId,
            updateMemberId
        }} >

            {children}
        </RoomContext.Provider>
    );
};

export { RoomProvider, useRoom };