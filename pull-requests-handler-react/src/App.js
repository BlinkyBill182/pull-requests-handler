import React from 'react';
import _ from 'lodash';
import { useContext } from 'react';

import { useLogin } from './hooks/useLogin';
import { useLogout } from './hooks/useLogout';

import { AuthContext } from './contexts/AuthContext';

const App = () => {
    const {login} = useLogin();
    const {logout} = useLogout();

    const { userData: {
        userPullRequests,
        userRequestedReviews
    } } = useContext(AuthContext);

    return (
        <div className="App">
            <div className="container">
                <div className="prs-container">
                    {
                        userPullRequests && Object.keys(userPullRequests).map((key, index) => {
                            const { url, title } = userPullRequests[key]
                            return <div className="pr-container" key={key} onClick={() => window.open(url, '_blank')} >
                                <div className="light yellow" />
                                <span>{ title }</span>
                            </div>
                        })
                    }
                    {
                        userRequestedReviews && Object.keys(userRequestedReviews).map((key, index) => {
                            const { url, title } = userRequestedReviews[key]
                            return <div className="pr-container" key={key} onClick={() => window.open(url, '_blank')} >
                                <div className="light red" />
                                <span>{ title }</span>
                            </div>
                        })
                    }
                </div>
                <div className="buttons-container">
                    {
                        _.isUndefined(userPullRequests) ?
                            <button className="btn" onClick={login}>
                                <img src={require('./svg/github.svg').default} alt='mySvgImage' />
                            </button> :
                            <button className="btn" onClick={logout}>
                                <img src={require('./svg/logout.svg').default} alt='mySvgImage' />
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default App;
