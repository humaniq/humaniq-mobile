import { Model, model, modelFlow, runUnprotected, tProp as p, types as t } from "mobx-keystone";
import RNWalletConnect from '@walletconnect/client';
import { CLIENT_OPTIONS, WALLET_CONNECT_ORIGIN } from "../../config/common";
import { getAppStore, getEVMProvider, getWalletConnectStore, getWalletStore } from "../../App";
import { closeToast, setPendingAppToast, setToast } from "../../utils/toast";
import { TOAST_POSITION } from "../../components/toasts/appToast/AppToast";
import { InteractionManager } from "react-native";
import { NativeTransaction } from "../wallet/transaction/NativeTransaction";
import { t as trans } from "../../i18n"
import { reaction } from "mobx";
import { TOASTER_TYPE } from "../app/AppStore";

@model("WalletConnect")
export class WalletConnect extends Model({
    redirectUrl: p(t.maybeNull(t.string), null),
    autosign: p(t.boolean, false),
}) {

    walletConnector: RNWalletConnect

    @modelFlow
    * init(options: any) {
        if (options.redirect) {
            this.redirectUrl = options.redirect
        }
        if (options.autosign) {
            this.autosign = options.autosign
        }

        this.walletConnector = new RNWalletConnect({ ...options, ...CLIENT_OPTIONS })
        this.updateSession()

        this.walletConnector.on('session_request', async (error, payload) => {
            console.log("WC:", payload)
            if (error) {
                throw error;
            }

            try {
                const sessionData = {
                    ...payload.params[0],
                    autosign: this.autosign,
                };
                if (getWalletConnectStore().approvalDialog.display) return
                getWalletConnectStore().approvalDialog.display = true
                getWalletConnectStore().approvalDialog.sessionData = sessionData

                const approved = await new Promise((resolve, reject) => {
                    getWalletConnectStore().approvalDialog.approvalRequest = { resolve, reject }
                })
                if (approved) {
                    await this.walletConnector.approveSession({
                        chainId: getEVMProvider().currentNetwork.chainID,
                        accounts: [ getWalletStore().selectedWallet?.address ],
                    });
                    getWalletConnectStore().addSessionToList(this)
                    getWalletConnectStore().persistSessions()
                }
            } catch (e) {

            }
        })

        this.walletConnector.on('call_request', async (error, payload) => {
            if (getWalletConnectStore().tempCallIds.includes(payload.id)) return;
            runUnprotected(() => {
                getWalletConnectStore().tempCallIds.push(payload.id);
            })
            if (error) {
                throw error;
            }

            const meta = this.walletConnector.session.peerMeta;
            if (payload.method) {
                if (payload.method === 'eth_sendTransaction') {
                    if (getWalletConnectStore().sendTransactionDialog.display) return
                    try {
                        const txParams = {};
                        Object.assign(txParams, {
                            to: payload.params[0].to,
                            from: payload.params[0].from,
                            value: payload.params[0].value || 0,
                            gas: payload.params[0].gas || 0,
                            gasPrice: payload.params[0].gasPrice || 0,
                            data: payload.params[0].data
                        })

                        await getWalletConnectStore().sendTransactionDialog.init(txParams, meta ? WALLET_CONNECT_ORIGIN + meta.url : undefined)
                        getWalletConnectStore().sendTransactionDialog.display = true

                        const approved = await new Promise((resolve, reject) => {
                            getWalletConnectStore().sendTransactionDialog.approvalRequest = {
                                resolve,
                                reject
                            }
                        })

                        getWalletConnectStore().sendTransactionDialog.display = false
                        setPendingAppToast(trans("sendTransactionDialog.transactionSending"), TOAST_POSITION.UNDER_TAB_BAR)

                        InteractionManager.runAfterInteractions(async () => {
                            // @ts-ignore
                            const tx = new NativeTransaction(approved.tx)
                            const result = await tx.sendTransaction()
                            if (result) {
                                this.walletConnector.approveRequest({
                                    id: payload.id,
                                    result: tx.hash,
                                });
                                tx.applyToWallet()
                                setTimeout(async () => {
                                    await tx.waitTransaction()
                                }, 10)
                                closeToast()
                            } else {
                                setToast("Error send transaction", TOASTER_TYPE.ERROR, null, true)
                                this.walletConnector.rejectRequest({
                                    id: payload.id,
                                    error: { message: "Error send transaction" },
                                });
                            }
                        })

                    } catch (error) {
                        this.walletConnector.rejectRequest({
                            id: payload.id,
                            error: { message: "user reject request" },
                        });
                    }
                } else if (payload.method === 'eth_sign') {
                    let rawSig = null;
                    try {
                        if (payload.params[2]) {
                            throw new Error('Autosign is not currently supported');
                        } else {
                            const data = payload.params[1];
                            const from = payload.params[0];
                            rawSig = await getAppStore().messageManager.addUnapprovedMessageAsync({
                                data,
                                from,
                                meta: {
                                    title: meta && meta.name,
                                    url: meta && meta.url,
                                    icon: meta && meta.icons && meta.icons[0],
                                },
                                origin: WALLET_CONNECT_ORIGIN,
                            } as any);
                        }
                        this.walletConnector.approveRequest({
                            id: payload.id,
                            result: rawSig,
                        });
                    } catch (error) {
                        this.walletConnector.rejectRequest({
                            id: payload.id,
                            error,
                        });
                    }
                } else if (payload.method === 'personal_sign') {
                    let rawSig = null;
                    try {
                        if (payload.params[2]) {
                            throw new Error('Autosign is not currently supported');
                        } else {
                            const data = payload.params[0];
                            const from = payload.params[1];

                            rawSig = await getAppStore().personalMessageManager.addUnapprovedMessageAsync({
                                data,
                                from,
                                meta: {
                                    title: meta && meta.name,
                                    url: meta && meta.url,
                                    icon: meta && meta.icons && meta.icons[0],
                                },
                                origin: WALLET_CONNECT_ORIGIN,
                            } as any);
                        }
                        this.walletConnector.approveRequest({
                            id: payload.id,
                            result: rawSig,
                        });
                    } catch (error) {
                        this.walletConnector.rejectRequest({
                            id: payload.id,
                            error,
                        });
                    }
                } else if (payload.method === 'eth_signTypedData' || payload.method === 'eth_signTypedData_v3') {
                    try {
                        const rawSig = await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                            {
                                data: payload.params[1],
                                from: payload.params[0],
                                meta: {
                                    title: meta && meta.name,
                                    url: meta && meta.url,
                                    icon: meta && meta.icons && meta.icons[0],
                                },
                                origin: WALLET_CONNECT_ORIGIN,
                            } as any,
                            'V3'
                        );

                        this.walletConnector.approveRequest({
                            id: payload.id,
                            result: rawSig,
                        });
                    } catch (error) {
                        this.walletConnector.rejectRequest({
                            id: payload.id,
                            error,
                        });
                    }
                } else if (payload.method === 'eth_signTypedData_v4') {
                    try {
                        const rawSig = await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                            {
                                data: payload.params[1],
                                from: payload.params[0],
                                meta: {
                                    title: meta && meta.name,
                                    url: meta && meta.url,
                                    icon: meta && meta.icons && meta.icons[0],
                                },
                                origin: WALLET_CONNECT_ORIGIN,
                            } as any,
                            'V4'
                        );

                        this.walletConnector.approveRequest({
                            id: payload.id,
                            result: rawSig,
                        });
                    } catch (error) {
                        this.walletConnector.rejectRequest({
                            id: payload.id,
                            error,
                        });
                    }
                }
            }
        })

        this.walletConnector.on('disconnect', (error) => {
            if (error) {
                throw error;
            }
            this.walletConnector = null;
            getWalletConnectStore().persistSessions();
        });

        this.walletConnector.on('session_update', (error) => {
            if (error) {
                throw error;
            }
        });

        reaction(() => getEVMProvider().currentNetworkName, () => {
            this.updateSession()
        })

        reaction(() => getWalletStore().selectedWallet?.address, () => {
            this.updateSession()
        })
    }

    updateSession() {
        try {
            if (!this.walletConnector.session.connected) return
            this.walletConnector.updateSession({
                chainId: getEVMProvider().currentNetwork.chainID,
                accounts: [ getWalletStore().selectedWallet?.address ],
            });
        } catch (e) {
            console.log('ERROR', e);
        }
    }

    killSession = () => {
        this.walletConnector && this.walletConnector.killSession();
        this.walletConnector = null;
    };
}