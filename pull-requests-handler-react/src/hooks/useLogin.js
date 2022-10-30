import { getDatabase, ref, onValue} from "firebase/database";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useLogin = () => {
    const [error, setError] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const provider = new GithubAuthProvider();
    const { dispatch } = useContext(AuthContext);

    const login = async () => {
        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            if (!res) {
                throw new Error("Could not complete signIn");
            }
            debugger;
            const userData = res.user;
            const userId = userData.providerData[0].uid;

            // read from db
            const db = getDatabase();
            const usersDbRef = ref(db, 'users/' + userId);
            onValue(usersDbRef, (snapshot) => {
                const pullRequests = snapshot.val();
                dispatch({ type: "LOGIN", payload: {userData} });
            });

            setIsPending(false)
        } catch (error) {
            console.log(error);
            setError(error.message);
            setIsPending(false);
        }
    };

    return { login, error, isPending };
};