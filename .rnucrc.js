const fs = require('fs');
const path = require('path');

async function setupFirebase({ ios, android }) {
  const ROOT = process.cwd();

  await fs.promises.copyFile(
    path.resolve(ROOT, '.', ios),
    path.resolve(ROOT, '.', 'ios/GoogleService-Info.plist')
  );

  await fs.promises.copyFile(
    path.resolve(ROOT, '.', android),
    path.resolve(ROOT, '.', 'android/app/google-services.json')
  );
}

module.exports = {
  on_env: async function ({ FIREBASE_CONFIG }) {
    await setupFirebase(FIREBASE_CONFIG);
  },
};
