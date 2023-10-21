const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron');
const { getIcon } = require("./utils");

const { initializeApp } = require('@firebase/app');
const { getFunctions, httpsCallable } = require('@firebase/functions');
const { getFirestore, collection, getDocs } = require('@firebase/firestore');
const { getAuth, GithubAuthProvider, signInWithPopup, signInWithCustomToken} = require('@firebase/auth');

// GitHub Authentication
const githubOauthUrl = `https://github.com/login/oauth/authorize?client_id=910afe64a64a230d2628&redirect_uri=http://localhost:8082/callback`;

// GitHub Authentication using BrowserWindow
const signInWithGithub = () => {
    return new Promise((resolve, reject) => {
        let authWindow = new BrowserWindow({
            width: 500,
            height: 600,
            show: true,
            modal: true,
            webPreferences: {
                nodeIntegration: false,
                partition: 'persist:main',
                session: require('electron').session.defaultSession
            }
        });

        authWindow.loadURL(githubOauthUrl);
        authWindow.on('closed', () => {
            reject(new Error('Window was closed by user'));
        });

        authWindow.webContents.on('will-redirect', (event, url) => {
            if (url.startsWith('http://localhost:8000/callback')) {
                const matched = url.match(/code=([\w_\-]+)/i);
                if (matched && matched[1]) {
                    resolve(matched[1]);
                    authWindow.close();
                } else {
                    reject(new Error('No code found in GitHub OAuth response'));
                }
            }
        });
    });
};

// Fetch Data from Firestore and Build Menu
const fetchDataAndBuildMenu = async (tray) => {
    let menuItems = [];

    try {
        const snapshot = await getDocs(dataRef);
        snapshot.forEach(doc => {
            menuItems.push({
                label: doc.data().YOUR_FIELD_NAME, // Replace with your field's name
                type: 'radio'
            });
        });

        const contextMenu = Menu.buildFromTemplate(menuItems);
        tray.setContextMenu(contextMenu);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const getFirebaseTokenFromGithubCode = async (code) => {
    const getTokenFunction = httpsCallable(functionsInstance, 'exchangeGithubCodeForFirebaseToken');
    try {
        const result = await getTokenFunction({ code });
        return result.data.token;
    } catch (error) {
        console.error('Error fetching Firebase token:', error);
        throw error;
    }
};

app.whenReady().then(async () => {
    const iconBase64 = getIcon();
    const icon = nativeImage.createFromDataURL(iconBase64);
    const tray = new Tray(icon);
});

