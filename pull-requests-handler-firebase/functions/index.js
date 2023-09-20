const { getDatabase, ref, set, remove, update } = require("firebase/database");
const { oauth2 } = require('google-auth-library');
const admin = require('firebase-admin');

const functions = require("firebase-functions");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyCrOVODfIwv0St5W9aeD80k1rJRDwXqbDE",
  authDomain: "pull-requests-handler.firebaseapp.com",
  databaseURL: "https://pull-requests-handler-default-rtdb.firebaseio.com",
  projectId: "pull-requests-handler",
  storageBucket: "pull-requests-handler.appspot.com",
  messagingSenderId: "207968340936",
  appId: "1:207968340936:web:a79ed6867bb8f0996f0efd"
};

const app = initializeApp(firebaseConfig);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest(async (request, response) => {
  console.log('request', request.body);
  const { review: { state: reviewState } = {}, pull_request: { id: pullRequestId, user, state, html_url: url, title }, action, mergeable, mergeable_state, requested_reviewer } = request.body
  const { id: userId, login: username } = user
  const db = getDatabase();

  switch (action){
    case 'submitted':
      if(reviewState === 'approved'){
        await update(ref(db, 'users/' + userId + '/' + pullRequestId), {
          state: reviewState
        });
      }
      if(reviewState === 'changes_requested'){
        await update(ref(db, 'users/' + userId + '/' + pullRequestId), {
          state: action,
        });
      }
      break;
    case 'closed':
      console.log('closed');
      await remove(ref(db, 'users/' + userId + '/' + pullRequestId));
      break;
    case 'review_requested':
      const { id: reviewer_id, login: reviewer_username } = requested_reviewer;
      await update(ref(db, 'users/' + userId + '/' + pullRequestId), {
        state: action,
        reviewer: {
          id: reviewer_id,
          username: reviewer_username
        }
      });
      break;
    case 'reopened':
    case 'opened':
      console.log('opened');
      await update(ref(db, 'users/' + userId), {});

      await update(ref(db, 'users/' + userId + '/' + pullRequestId), {
        state,
        url,
        title,
      });
      break;
    default:
      break;
  }

  if(mergeable || mergeable_state === 'clean'){
    await update(ref(db, 'users/' + userId + '/' + pullRequestId), {
      mergeable: true,
    });
  }


  console.log('end');
  response.send(`event" ${request.body}`);
});

exports.exchangeGithubCodeForFirebaseToken = functions.https.onCall(async (data, context) => {
  const CLIENT_ID = 'Iv1.bb0106805da87921'; // Your GitHub Client ID
  const CLIENT_SECRET = '12f4cb2707c54e083f4707613bfecbd9db40eeb6'; // Your GitHub Client Secret

  const { code } = data;

  const client = new oauth2.OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'http://localhost:8000/callback'); // The callback URL

  // Exchange the code for an access token
  const { tokens } = await client.getToken(code);

  // Now let's get the user's GitHub username using the access token
  const octokit = new Octokit({ auth: tokens.access_token });
  const user = await octokit.rest.users.getAuthenticated();

  // Here, we're using the GitHub username as the uid in Firebase. You can adjust this if needed.
  const firebaseToken = await admin.auth().createCustomToken(user.data.login);

  return { token: firebaseToken };
});

exports.myFunction = functions.https.onCall((data, context) => {
  console.log('start');
  return {
    result: 'Success'
  };
});
