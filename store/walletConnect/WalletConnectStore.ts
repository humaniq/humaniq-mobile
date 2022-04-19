import { _await, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { localStorage } from "../../utils/localStorage";
import { WalletConnect } from "./WalletConnect";
import { parseWalletConnectUri } from '@walletconnect/utils';

@model("WalletConnectStore")
export class WalletConnectStore extends Model({
    sessions: p(t.array(t.model<WalletConnect>(WalletConnect)), () => []),
    initialized: p(t.boolean, false),
    tempCallIds: p(t.array(t.number), () => [])
}) {
    approvalDialog
    sendTransactionDialog

    @modelFlow
    * init(approvalDialog, sendTransactionDialog) {
        this.approvalDialog = approvalDialog
        this.sendTransactionDialog = sendTransactionDialog

        const sessions = (yield* _await(localStorage.load("hm-wallet-wallet-connect-sessions"))) || []
        if (sessions) {
            sessions.forEach((session) => {
                const wc = new WalletConnect({})
                wc.init({ session })
                this.sessions.push(wc);
            });
        }
        this.initialized = true;
    }

    @modelFlow
    * persistSessions() {
        const sessions = this.sessions
            .filter(
                (connector) => connector && connector.walletConnector && connector && connector.walletConnector.connected
            )
            .map((connector) => connector.walletConnector.session);
        localStorage.save("hm-wallet-wallet-connect-sessions", sessions)
    }

    @modelFlow
    * newSession(uri: string, redirect?: string, autosign?: boolean) {
        const data = { uri };
        if (redirect) {
            Object.assign(data, { redirect })
        }
        if (autosign) {
            Object.assign(data, { autosign })
        }
        const wc = new WalletConnect({})
        yield wc.init(data)
        this.sessions.push(wc);
    }

    @modelFlow
    * getSessions() {
        let sessions = [];
        const sessionData = yield* _await(localStorage.load("hm-wallet-wallet-connect-sessions"))
        if (sessionData) {
            sessions = JSON.parse(sessionData);
        }
        return sessions;
    }

    @modelFlow
    * killSession(id) {
        const connectorToKill = this.sessions.find(
            (connector) => connector && connector.walletConnector && connector.walletConnector.session.peerId === id
        );
        if (connectorToKill) {
            yield* _await(connectorToKill.killSession())
        }
        this.sessions = this.sessions.filter(
            (connector) =>
                connector &&
                connector.walletConnector &&
                connector.walletConnector.connected &&
                connector.walletConnector.session.peerId !== id
        );
        this.persistSessions();
    }

    isValidUri(uri) {
        const result = parseWalletConnectUri(uri);
        if (!result.handshakeTopic || !result.bridge || !result.key) {
            return false;
        }
        return true;
    }
}