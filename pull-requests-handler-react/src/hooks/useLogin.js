import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { useState } from "react";

export const useLogin = () => {
    const [error, setError] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const provider = new GithubAuthProvider();

    const login = async () => {
        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            if (!res) {
                throw new Error("Could not complete signIn");
            }
            setIsPending(false)
        } catch (error) {
            console.log(error);
        }
    };

    return { login, error, isPending };
};