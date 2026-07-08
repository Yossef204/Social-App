import {FirebaseNotificationProvider} from "./firebase.service";
import * as fs from "node:fs";
import * as path from "node:path";
const config = JSON.parse(fs.readFileSync(path.resolve('./src/config/social-app-78d4e-firebase-adminsdk-fbsvc-e4caa951ee.json')) as unknown as string)

export const firebaseNotificationProvider = new FirebaseNotificationProvider(config)