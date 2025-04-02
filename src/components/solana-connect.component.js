import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import React from 'react';
import * as Linking from 'expo-linking';

import nacl from "tweetnacl";
import bs58 from "bs58";
import { Buffer } from "buffer";

import { useDispatch, useSelector } from 'react-redux';
import { connectSolana, loginWithSolana } from '../redux/slices/user.slice';

import { setError } from '../redux/slices/error.slice';
import { errors } from '../error-messages';


import {
    SOLANA_CLUSTER, SOLANA_SIGN_IN_MESSAGE,
    SOLANA_PHANTOM_CONNECT_URL, SOLANA_PHANTOM_SIGN_MESSAGE_URL,
    SOLANA_SOLFLARE_CONNECT_URL, SOLANA_SOLFLARE_SIGN_MESSAGE_URL,
} from '../constants';


const encryptPayload = (payload, sharedSecret=null) => {
if (!sharedSecret) throw new Error("missing shared secret (encrypt)");

const nonce = nacl.randomBytes(24);

const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
);

return [nonce, encryptedPayload];
};

export const decryptPayload = (
data,
nonce,
sharedSecret=null,
) => {
if (!sharedSecret) throw new Error("missing shared secret (decrypt)");

console.log(bs58.decode(data))
console.log(bs58.decode(nonce))
console.log(sharedSecret)


const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
);

console.log('decrdata=', decryptedData)

if (!decryptedData) {
    throw new Error("Unable to decrypt data");
}
return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};


const SolanaConnectComponent = ({RenderComponent, walletApp}) => {
    const [dappKeyPair] = React.useState(nacl.box.keyPair());
    const [sharedSecret, setSharedSecret] = React.useState();
    const [publicKey, setPublicKey] = React.useState();
    const [deepLink, setDeepLink] = React.useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const ON_CONNECT_SOLANA_WALLET_REDIRECT_LINK = Linking.createURL("onconnect_" + walletApp);
    const ON_SIGN_MESSAGE_SOLANA_WALLET_REDIRECT_LINK = Linking.createURL("onsignmessage_" + walletApp);


    // On app start up, listen for a "url" event
    React.useEffect(() => {
        const initializeDeeplinks = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
            setDeepLink(initialUrl);
        }
        };
        initializeDeeplinks();
        const listener = Linking.addEventListener("url", handleDeepLink);
        return () => {
            listener.remove();
        };
    }, []);

    React.useEffect(() => {
        if (!deepLink) return;

        const url = new URL(deepLink);
        const params = url.searchParams;

        // Handle an error response from Phantom
        if (params.get("errorCode")) {
        const error = Object.fromEntries([...params]);
        const message =
            error?.errorMessage ??
            JSON.stringify(Object.fromEntries([...params]), null, 2);
        console.error("error: ", message);
        return;
        }

        const onConnectRegex = new RegExp(`onconnect_${walletApp}`)
        const onSignMessageRegex = new RegExp(`onsignmessage_${walletApp}`)
        console.log(url)
        
        // Handle a `connect` response from Phantom
        if (onConnectRegex.test(url.pathname) || onConnectRegex.test(url.hostname)) {        
            console.debug(`we received a connect response from ${walletApp}: `, url);
            const sharedSecretDapp = nacl.box.before(
                bs58.decode(url.searchParams.get(
                    walletApp === 'phantom' ? "phantom_encryption_public_key" :
                    walletApp === 'solflare' ? "solflare_encryption_public_key" : null
                )),
                dappKeyPair.secretKey
            );
            setSharedSecret(sharedSecretDapp)

            const connectData = decryptPayload(
                params.get("data"),
                params.get("nonce"),
                sharedSecretDapp
            );
            console.debug(`decrypted data received from ${walletApp}: `, connectData);
            
            const session = connectData['session']
            setPublicKey(connectData['public_key'])

            requestSignMessage(session, sharedSecretDapp)
        }
        else if (onSignMessageRegex.test(url.pathname) || onSignMessageRegex.test(url.hostname)) {
            console.debug(`we received a SIGN MESSAGE response from ${walletApp}: `, url);
            const signMessageData = decryptPayload(
                params.get("data"),
                params.get("nonce"),
                sharedSecret
            );

            console.debug(signMessageData);

            const solanaConnectObject = {
                // publicKey: signMessageData['publicKey'],
                publicKey: publicKey,
                signedMessage: bs58.encode(Buffer.from(SOLANA_SIGN_IN_MESSAGE)),
                signature: signMessageData['signature'],
            }

            dispatch(
                user.isAuthenticated ? 
                connectSolana(solanaConnectObject) : // just connect an account to existing user
                loginWithSolana(solanaConnectObject) // create a user and then connect an account
            )
            .unwrap()
            .catch((rejectedValueOrSerializedError) => {
                console.error(rejectedValueOrSerializedError)
                // console.log(rejectedValueOrSerializedError['detail'][0])
                dispatch(setError({
                    message: errors.LOGIN_ERROR,
                    detail: rejectedValueOrSerializedError
                }));
            })
        }
    }, [deepLink]); 

    // When a "url" event occurs, track the url
    const handleDeepLink = ({ url }) => {
        setDeepLink(url);
    };


    const requestConnectWallet = () => {
        const params = new URLSearchParams({
        cluster: SOLANA_CLUSTER,
        app_url: 'https://ocada.ai',
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
        redirect_link: ON_CONNECT_SOLANA_WALLET_REDIRECT_LINK,
        });

        // phantom
        let url = walletApp === 'phantom' ? `${SOLANA_PHANTOM_CONNECT_URL}?${params.toString()}` :
            walletApp === 'solflare' ? `${SOLANA_SOLFLARE_CONNECT_URL}?${params.toString()}` : null

        Linking.openURL(url)
    }

    const requestSignMessage = (session, sharedSecretDapp) => {

        // const message = 'Sign the message to confirm your ownership of the wallet. You will not be charged.'
        const payload = {
            session,
            message: bs58.encode(Buffer.from(SOLANA_SIGN_IN_MESSAGE)),
        };

        const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecretDapp);

        const params = new URLSearchParams({
            dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
            nonce: bs58.encode(nonce),
            redirect_link: ON_SIGN_MESSAGE_SOLANA_WALLET_REDIRECT_LINK,
            payload: bs58.encode(encryptedPayload),
        });

        const url = walletApp === 'phantom' ? `${SOLANA_PHANTOM_SIGN_MESSAGE_URL}?${params.toString()}` :
            walletApp === 'solflare' ? `${SOLANA_SOLFLARE_SIGN_MESSAGE_URL}?${params.toString()}` : null
        Linking.openURL(url)
    }

    return <RenderComponent onPress={requestConnectWallet} />
}

export default SolanaConnectComponent;