const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  // Check if the user is an instructor (you can add your own logic here)
  const isInstructor = user.email.endsWith('@dict.gov.ph'); // Example condition

  if (isInstructor) {
    // Create instructor document
    const instructorData = {
      fullName: user.displayName || '',
      email: user.email,
      department: '',
      expertise: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      role: 'instructor'
    };

    await admin.firestore().collection('instructors').doc(user.uid).set(instructorData);
  } else {
    // Create student document (existing logic)
    const userData = {
      name: user.displayName || '',
      email: user.email,
      course: 'Not Set',
      yearLevel: 'Not Set',
      fitnessLevel: 'Beginner',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      searchTerms: [
        user.displayName?.toLowerCase(),
        user.email.toLowerCase(),
      ].filter(Boolean)
    };

    await admin.firestore().collection('users').doc(user.uid).set(userData);
  }
});

// Update last active timestamp
exports.updateLastActive = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { isInstructor } = data;
  const collection = isInstructor ? 'instructors' : 'users';

  return admin.firestore().collection(collection).doc(context.auth.uid).update({
    lastActive: admin.firestore.FieldValue.serverTimestamp()
  });
}); 