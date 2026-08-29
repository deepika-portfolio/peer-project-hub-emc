const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {

  throw new Error(

    "FIREBASE_SERVICE_ACCOUNT environment variable is missing"

  );

}

let serviceAccount;

try {

  serviceAccount = JSON.parse(

    process.env.FIREBASE_SERVICE_ACCOUNT

  );

} catch (error) {

  throw new Error(

    `Invalid FIREBASE_SERVICE_ACCOUNT JSON: ${error.message}`

  );

}

if (!admin.apps.length) {

  admin.initializeApp({

    credential: admin.credential.cert(serviceAccount),

  });

}

module.exports = admin;
 
