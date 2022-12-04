export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, userData: undefined, user: undefined };
        case "AUTH_IS_READY":
            return { ...state, user: action.payload, authIsReady: true };
        case "DATA_RETRIEVE":
            return { ...state, userData: action.payload };
        default:
            return state;
    }
};