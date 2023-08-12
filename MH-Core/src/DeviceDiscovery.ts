import * as dgram from 'dgram';
import { Network } from './Network';
import { DeviceInterface } from './DeviceInterface';
import { Transport } from './Transport';
import { IProtoDevice, ICompleteDevice, ICompleteResponse, ICompleteDeviceInfo, DEFAULT_COMPLETE_RESPONSE } from './types';
import { mergeDeep, sleepTimeout } from './specs/miscUtils';


const BROADCAST_PORT: number = 48899;
const BROADCAST_MAGIC_STRING: string = 'HF-A11ASSISTHREAD';

export async function discoverDevices(timeout = 500, customSubnets: string[] = []): Promise<IProtoDevice[]> {
  const userInterfaces: string[] = [];

  if (dockerHostMode()) {
    userInterfaces.push("255.255.255.255");
  } else {
    for (const subnet of Network.subnets()) {
      userInterfaces.push(subnet.broadcast);
    }
    userInterfaces.push(...customSubnets);
  }

  const protoDevicesSet = new Set<string>();
  const protoDevicesList: IProtoDevice[] = [];
  const socket: dgram.Socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  socket.bind(BROADCAST_PORT);

  socket.on('error', (err) => {
    socket.close();
    return err;
  });

  socket.on('listening', () => {
    socket.setBroadcast(true);
    for (const userInterface of userInterfaces) {
      socket.send(BROADCAST_MAGIC_STRING, BROADCAST_PORT, userInterface);
    }

  });

  socket.on('message', (msg, rinfo) => {
    const address = rinfo.address;
    const parts = msg.toString().split(',');
    if (parts.length !== 3) return;

    const [ipAddress, uniqueId, modelNumber] = parts;
    if (protoDevicesSet.has(uniqueId)) return;

    protoDevicesList.push({
      ipAddress,
      uniqueId,
      modelNumber,
    });

  });

  await sleepTimeout(timeout).catch(e => { throw 'sleep somehow failed' });
  socket.close();
  return protoDevicesList;


}

/**
 * 
 * @param protoDevices IProtoDevice[]
 * @param timeout number
 * @returns completeDevice[]
 */

export async function completeDevices(protoDevices: IProtoDevice[], timeout = 500, retries = 3): Promise<ICompleteDevice[]> {
  if (protoDevices.length < 1) return;
  const deviceResponses: Promise<ICompleteDevice>[] = []
  const completedDevices: ICompleteDevice[] = [];
  const retryProtoDevices: IProtoDevice[] = [];

  protoDevices.forEach((protoDevice) => {
    deviceResponses.push(completeDevice(protoDevice, timeout));
  })

  await Promise.allSettled(deviceResponses).then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') completedDevices.push(result.value);
      else retryProtoDevices.push(result.reason.protoDevice)
    });
  });
  if (retryProtoDevices.length > 0 && retries > 0) completedDevices.push(... await completeDevices(retryProtoDevices, timeout, retries - 1).catch(e => { throw e }));

  return completedDevices;
}

async function completeDevice(protoDevice: IProtoDevice, timeout): Promise<ICompleteDevice> {
  const transport = new Transport(protoDevice.ipAddress);
  const deviceInterface = new DeviceInterface(transport);
  try {
    const completeResponse: ICompleteResponse = await deviceInterface.queryState(timeout);
    const completeDeviceInfo: ICompleteDeviceInfo = { deviceMetaData: completeResponse.deviceMetaData, protoDevice, latestUpdate: Date.now() }
    const completeDevice: ICompleteDevice = { completeResponse, deviceInterface, completeDeviceInfo }
    return completeDevice;
  } catch (e) {
    throw { protoDevice, response: 'invalidResponse' };
  }


}

/**
 * @param protoDevices IProtoDevice[]
 * @param timeout number
 * @returns completeDevice[]
 */
export function completeCustomDevices(completeDevicesInfo: ICompleteDeviceInfo[]): ICompleteDevice[] {
  const completeDevices: ICompleteDevice[] = [];

  for (const completeDeviceInfo of completeDevicesInfo) {
    const { protoDevice: { ipAddress } } = completeDeviceInfo;

    const transport = new Transport(ipAddress);
    const deviceInterface = new DeviceInterface(transport);

    const completeResponse: ICompleteResponse = mergeDeep({}, DEFAULT_COMPLETE_RESPONSE);
    const completeDevice: ICompleteDevice = { completeDeviceInfo, deviceInterface, completeResponse }
    completeDevices.push(completeDevice);
  };

  return completeDevices;
}

function dockerHostMode(): boolean {
  return !!process.env.DOCKER_HOST_NETWORK;
}