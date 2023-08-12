class ErrorBase {
    public code: number;
    public name: string;
    public description: string;

    constructor(code: number, name: string, description: string) {
        this.code = code;
        this.name = name;
        this.description = description;
    }

    public toString() {
        return `${this.name} (${this.code}): ${this.description}`;
    }
}

export class ErrorTypes {
    public static BUFFER_LENGTH_ERROR = new ErrorBase(-9, 'Incorrect Buffer Length', 'The buffer length was incorrect');
    public static DEVICE_UNRESPONSIVE_ERROR = new ErrorBase(-8, 'Device Unresponsive', 'The device did not respond');
    public static SOCKET_ERROR = new ErrorBase(-7, 'Socket Error', 'The socket reported an error');
    public static COMMAND_TIMEOUT_ERROR = new ErrorBase(-6, 'Command Timeout', 'The command/query timed out');
    public static DUPLICATE_POWER_COMMAND_ERROR = new ErrorBase(-5, 'Duplicate Power Command', 'The power command was a duplicate');
    public static INCORRECT_DEVICE_STATE_ERROR = new ErrorBase(-4, 'Incorrect Device State', 'The device state was incorrect');
    public static SOCKET_CLOSED_ERROR = new ErrorBase(-2, 'Socket Closed', 'The socket was closed before resolving');
    public static UNKNOWN_FAILURE_ERROR = new ErrorBase(-1, 'Unknown Failure', 'An unknown failure occurred');
    public static UNNECESSARY_QUERY_ERROR = new ErrorBase(0, 'Unnecessary Query', 'The query was unnecessary');

    public static getError(code: number): ErrorBase | undefined {
        for (const key in ErrorTypes) {
            if (ErrorTypes[key] instanceof ErrorBase && ErrorTypes[key].code === code) {
                return ErrorTypes[key];
            }
        }
        return undefined;
    }

    public static addError(code: number, name: string, description: string): void {
        if (ErrorTypes.getError(code)) {
            throw new Error('Error code already exists')
        }
        ErrorTypes[name.toUpperCase().replace(/[\W_]+/g, "_")] = new ErrorBase(code, name, description);
    }
}


