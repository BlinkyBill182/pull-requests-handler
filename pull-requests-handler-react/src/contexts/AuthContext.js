import { createContext, useEffect, useReducer } from 'react';
import { authReducer } from '../reducers/authReducer';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { auth, database } from '../firebase/config';


export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        userData: {},
        authIsReady: false,
    });

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            dispatch({type: "AUTH_IS_READY", payload: user});
        });
    }, []);

    useEffect(() => {
        if(state.user){
            const userId = state.user.auth.currentUser.providerData[0].uid
            const res = ref(database, `/users/${userId}`);

            return onValue(res, (user) => {
                const userData = user.val();
                dispatch({type: "DATA_RETRIEVE", payload: userData});
            });
        }
    }, [state.user]);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;