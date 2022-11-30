import React from 'react';
import { useContext } from 'react';

import { useLogin } from './hooks/useLogin';
import { useLogout } from './hooks/useLogout';

import { AuthContext } from './contexts/AuthContext';

const App = () => {
    const {login, isPending} = useLogin();
    const {logout} = useLogout();

    const { userData } = useContext(AuthContext);

    return (
        <div className="App">
            {
                JSON.stringify(userData)
            }
            <button className="btn" onClick={login}>
                {isPending ? 'Loading...' : 'Login With Github'}
            </button>
            <button className="btn" onClick={logout}>
                Log Out
            </button>
        </div>
    );
};

export default App;
