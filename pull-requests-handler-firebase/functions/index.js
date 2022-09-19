const { getDatabase, ref, set, remove, update } = require("firebase/database");

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
  functions.logger.info("Hello logs!", {structuredData: true});
  console.log('request', request.body);
  const { pull_request: { id: pullRequestId, user, state }, action, url, mergeable, mergeable_state } = request.body
  const { id: userId, login: username } = user
  const db = getDatabase();

  switch (action){
    case 'closed':
      console.log('closed');
      await remove(ref(db, 'users/' + userId));
      break;
    case 'reopened':
    case 'opened':
      console.log('opened');
      await set(ref(db, 'users/' + userId + '/' + pullRequestId), {
        username,
        state,
        url,
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
