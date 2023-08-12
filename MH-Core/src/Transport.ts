import net, { Socket } from 'net';
import { DEVICE_COMMAND_BYTES, ICompleteResponse, ITransportResponse } from './types';
import { asyncWaitCurveball, bufferFromByteArray, bufferToDeviceResponse as bufferToCompleteResponse, mergeDeep, overwriteDeep, ValidationError } from './specs/miscUtils';
// import net from './tests/mock-net';
import { Mutex } from './specs/miscUtils';

const PORT = 5577;
const SOCKET_TIMEOUT_MS = 10000;
const IDLE_TIMEOUT_MS = 30 * 1000; // 30 seconds

export class Transport {
    private mutex: Mutex;
    private socket: Socket;
    private connected = false;
    private idleTimer: NodeJS.Timeout;
    constructor(private ipAddress: string) {
        this.mutex = new Mutex();
    }

    private async connect(): Promise<void> {
        this.socket = new net.Socket();
        const options = {
            host: this.ipAddress,
            port: PORT,
            timeout: SOCKET_TIMEOUT_MS
        };



        this.socket.connect(options);
        try {
            await wait(this.socket, 'connect', SOCKET_TIMEOUT_MS, null, null);
            this.connected = true;
            this.startIdleTimer();
            this.socket.on('error', (error) => {
                throw "Socket Error: " + error;
            });
        } catch (err) {
            this.disconnect(true);
            throw err;
        }
    }

    private async disconnect(forceDestroy = false): Promise<void> {
        this.stopIdleTimer();
        const release = await this.mutex.lock();

        if (forceDestroy) {
            this.socket.destroy();
            this.socket.removeAllListeners();
            this.connected = false;
            release();
        } else if (this.connected) {
            this.startIdleTimer(true);
            this.socket.end();
            this.socket.on('close', () => {
                // console.log("Socket closed gracefully")
                this.stopIdleTimer()
                this.socket.removeAllListeners();
                this.connected = false;
                release();
            })

        }
    }

    private startIdleTimer(forceDestroy = false): void {
        this.stopIdleTimer();
        this.idleTimer = setTimeout(() => {
            // console.log(`Connection has been idle for ${IDLE_TIMEOUT_MS}ms. Disconnecting.`);
            this.disconnect(forceDestroy);
        }, IDLE_TIMEOUT_MS);
    }

    private stopIdleTimer(): void {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
    }

    private resetIdleTimer(): void {
        this.stopIdleTimer();
        this.startIdleTimer();
    }

    public async send(byteArray: number[]): Promise<void> {
        const release = await this.mutex.lock();
        const buffer = bufferFromByteArray(byteArray);
        if (!this.connected) {
            // console.log('Not connected. Attempting to connect...');
            await this.connect().catch((err) => {
                // console.error('Error in MH Core Transport Class Send: ', err);
                // throw err;
            });
        }
        this.socket.write(buffer);
        this.resetIdleTimer();
        release();
    }

    async requestState(timeout: number): Promise<Buffer> {
        const release = await this.mutex.lock();
        if (!this.connected) await this.connect().catch((err) => {
            console.error('Error in MH Core Transport Class requestState: ', err);
            // throw err;
        });
        // await asyncWaitCurveball(3000)
        const requestBuffer = bufferFromByteArray(DEVICE_COMMAND_BYTES.COMMAND_QUERY_STATE);

        try {
            const data = await wait(this.socket, 'data', timeout, requestBuffer, null);
            this.resetIdleTimer();
            return data;
        } catch (err) {
            throw err;
        } finally {
            release();
        }
    }

}

async function wait(emitter: Socket, eventName: string, timeout: number, writeData: Buffer, callback): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let timer: NodeJS.Timeout;

        const listener = (data: Buffer) => {
            // console.log("listener called: ", eventName)
            clearTimeout(timer);
            emitter.removeListener(eventName, listener); // remove the listener
            resolve(data);
        };

        timer = setTimeout(() => {
            emitter.off(eventName, listener);
            reject(`timed out while awaiting: ${eventName}.Timeout: ${timeout}ms`);
        }, timeout);

        emitter.on(eventName, listener);

        if (writeData) emitter.write(writeData);
        if (callback) callback()
    });
}
