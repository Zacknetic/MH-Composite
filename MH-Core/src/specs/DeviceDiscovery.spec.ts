// // import { DeviceInterface } from '../DeviceInterface'
// // import { ICommandOptions, ICommandResponse, IDeviceCommand } from '../types';

// import assert = require('assert');
// import { discoverDevices, completeDevices, completeCustomDevices } from '../DeviceDiscovery';
// import { ICompleteDevice, ICompleteDeviceInfo, IDeviceMetaData, IProtoDevice } from '../types';
// // import * as types from '../types'

// let protoDevices: IProtoDevice[];
// let completedDevices: ICompleteDevice[];
// describe('Test DeviceDiscovery class functions', function () {
//     it('Should scan for devices and create Prototype[]', async function () {
//         protoDevices = await discoverDevices();
//         assert.strictEqual(protoDevices.length > 0, true);
//         console.log(protoDevices)
//     })


//     it('Should create a CompleteDevice for each ProtoDevice', async function () {
//         const completedDevices: ICompleteDevice[] = await completeDevices(protoDevices, 500, 10);
//         assert.strictEqual(protoDevices.length, completedDevices.length);
//     })

//     it('Should create a valid custom device using partial data', function () {
//         const protoDevice: IProtoDevice = { ipAddress: "192.168.1.12", uniqueId: 'random', modelNumber: 'zacknetic001' }
//         const deviceMetaData: IDeviceMetaData = { controllerHardwareVersion: 0x35, controllerFirmwareVersion: 0x09, rawData: Buffer.from([0, 0]) }
//         const completeDeviceInfo: ICompleteDeviceInfo = { protoDevice, deviceMetaData, latestUpdate: Date.now() }
//         const customDevices: ICompleteDevice[] = completeCustomDevices([completeDeviceInfo])
//         assert.deepStrictEqual(customDevices[0].completeDeviceInfo.protoDevice, {
//             ipAddress: "192.168.1.12",
//             modelNumber: "zacknetic001",
//             uniqueId: "random",
//         })
//     })
// });
