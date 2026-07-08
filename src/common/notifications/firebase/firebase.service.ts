import {INotificationProvider} from "../notification.interface";
import admin from "firebase-admin";
import {App, cert, getApp, getApps, initializeApp} from "firebase-admin/app";
import {getMessaging} from "firebase-admin/messaging";
export class FirebaseNotificationProvider implements INotificationProvider{
    private client : App ;
    constructor(config:any) {
        this.client = initializeApp({
            credential:cert(config)
        })
    }

    async send(token: string, data: { title: string; body: string }): Promise<void> {
        await getMessaging(this.client).send({token,notification:{title : data.title , body : data.body}})
    }
}