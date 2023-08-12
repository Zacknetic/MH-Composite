import { ICompleteResponse } from "../types";

export function bufferToDeviceResponse(data: Buffer): ICompleteResponse {
  if (!Buffer.isBuffer(data) || data.length < 14) throw new Error('test');
  ;

  const completeResponse: ICompleteResponse = {

    responseCode: 1,
    deviceState: {
      isOn: data.readUInt8(2) === 0x23,
      RGB: {
        red: data.readUInt8(6),
        green: data.readUInt8(7),
        blue: data.readUInt8(8),
      },
      CCT: {
        warmWhite: data.readUInt8(9),
        coldWhite: data.readUInt8(11),
      }
    },

    deviceMetaData: {
      controllerHardwareVersion: data.readUInt8(1),
      controllerFirmwareVersion: data.readUInt8(10),
      rawData: data,
    }

  }

  return completeResponse;
}

export function calcChecksum(buffer: Uint8Array) {
  let checksum = 0;

  for (const byte of buffer) {
    checksum += byte;
  }

  checksum = checksum & 0xff;
  const finalCommand = Buffer.concat([buffer, Buffer.from([checksum])]);

  return finalCommand;
}

export function bufferFromByteArray(byteArray: number[], useChecksum = true) {
  const buffer = Buffer.from(byteArray);
  let payload = buffer;

  if (useChecksum) payload = calcChecksum(buffer);

  return payload
}

export function deepEqual(object1, object2, omitKeysArr?: Array<string>) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  const omitSet = new Set(omitKeysArr ?? []);
  if (keys1.length !== keys2.length && omitKeysArr?.length <= 0) {
    return false;
  }
  for (const key of keys1) {

    if (omitSet.has(key)) continue;
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2, omitKeysArr) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: any, ...sources) {
  if (!sources.length) return target;
  if (!target) target = {};
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        if (target[key] == null) Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}


/**
 * Deep overwrite two objects.
 * @param target
 * @param ...sources
 */
export function overwriteDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (target[key]) Object.assign(target, { [key]: {} });
        overwriteDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return overwriteDeep(target, ...sources);
}

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function sleepTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class ValidationError extends Error {
  constructor(message, public responseCode: number) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
    this.responseCode = responseCode;
    this.stack = (new Error()).stack;
  }
}

export class Mutex {
  private locked = false;
  private queue: ((value: (() => void) | PromiseLike<() => void>) => void)[] = [];

  async lock(): Promise<() => void> {
    if (this.locked) {
      return new Promise((resolve: (value: (() => void) | PromiseLike<() => void>) => void, reject: (reason?: any) => void) => {
        this.queue.push(resolve);
      });
    } else {
      this.locked = true;
      return () => { this.unlock(); };
    }
  }

  unlock(): void {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve(() => { this.unlock(); });
    } else {
      this.locked = false;
    }
  }
}

export async function asyncWaitCurveball(timeout) {
  await new Promise(async (resolve, reject) => {
    await setTimeout(() => {
      resolve(true);
    }, 5000);
  });
}