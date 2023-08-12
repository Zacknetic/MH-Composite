import { MockMagicHomeDevice } from "./MockMagicHomeDevice";

const EventEmitter = require('events')

namespace net {

    export interface Socket {
        on,
        once,
        end,
        write,
        destroy,
    }

    export function connect({ port, host, timeout }) {
        const netSocket = new NetSocket()
        netSocket.onConnect(timeout);
        return netSocket;
    }

    export class NetSocket implements Socket {
        protected host: number;
        protected port: number;
        protected timeout: NodeJS.Timeout;
        protected eventEmitter;
        protected mockMagicHomeDevice
        constructor(mockDeviceSettings?) {
            this.mockMagicHomeDevice = new MockMagicHomeDevice();
            this.eventEmitter = new EventEmitter();
            this.eventEmitter.setMaxListeners(100)
        }

        //https://stackoverflow.com/questions/39820651/node-js-eventemitter-how-to-bind-a-class-context-to-the-event-listener-and-then 

        public once(event, callback) {
            this.eventEmitter.once(event, (ret?) => {
                callback(ret);
            });
        }

        public on(event, callback) {
            this.eventEmitter.on(event, (ret?) => {
                callback(ret);
            });
        }

        public async write(data, dataType?, callback?, testCommandOptions?) {
            try {
                const response = await this.mockMagicHomeDevice.mockSendDeviceCommand(data)
                if (response) {
                    this.emitData(response)
                }
            } catch (error) {
                this.emitError(error)
            }
            callback();
        }

        private emitData(data) {
            this.eventEmitter.emit('data', data)
        }

        private emitError(error) {
            this.eventEmitter.emit('error', error)
        }

        public async onConnect(timeout) {
            //wait for connections and then emit connect event
            this.timeout = setTimeout(() => {
                this.eventEmitter.emit('timeout')
            }, timeout);

            this.eventEmitter.emit('connect')
        }

        public async end() {
            clearTimeout(this.timeout)
            this.eventEmitter = new EventEmitter();
        }

        public async destroy() {
            // this.eventEmitter = null;
        }
    }
}

export default net;
