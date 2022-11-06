import React, { useContext, useEffect, useState } from "react";
import { ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient, } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
const initialValues: {} = {};

type Props = {
    children?: React.ReactNode;
};

const SubContext = React.createContext(initialValues);


const useSub = () => useContext(SubContext);

const SubProvider: React.FC<Props> = ({ children }) => {
    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

    useEffect(() => {
        const httpLink = new HttpLink({
            uri: 'http://localhost:4000/internal/graphql'
        });

        const wsLink = new GraphQLWsLink(
            createClient({
                url: 'ws://localhost:4000/internal/graphql',
                connectionParams: () => {
                    // Note: getSession() is a placeholder function created by you
                    return {};
                },
                // webSocketImpl: ws,

                // webSocketImpl: websocket,
            }),
        );

        const splitLink = split(
            ({ query }) => {
                const definition = getMainDefinition(query);
                return (
                    definition.kind === 'OperationDefinition' &&
                    definition.operation === 'subscription'
                );
            },
            wsLink,
            httpLink,
        );


        const clientData = new ApolloClient({
            link: splitLink,
            cache: new InMemoryCache()
        });

        setClient(clientData)
        return () => {

        }
    }, [])


    if (client == null) return <div> Loading</div>
    return (
        <SubContext.Provider value={{}} >

            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </SubContext.Provider>
    );
};

export { SubProvider, useSub };