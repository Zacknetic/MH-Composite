// import { ControllerGenerator } from '../ControllerGenerator';
// import { cctColorWave, cctRgbTest, cctWave, colorTest, colorWave, fireworks, hellStruck, thunderStruck } from '../animation/animationLibrary'
// const deviceList = [];
// import ChatGPTAnimation from '../utils/chatGPTAnimation';
// // import { DeviceInterface } from '../DeviceInterface'
// // import { ICommandOptions, ICommandResponse, IDeviceCommand } from '../types';

// import { BaseController } from '../BaseController';
// import { COMMAND_TYPE, ICommandOptions, IDeviceCommand } from 'magichome-core';
// import { IAnimationLoop } from '../utils/types';
// import { sleepTimeout } from 'magichome-core/dist/utils/miscUtils';
// import { Console } from 'console';

// // import * as types from '../types'

// const controllerGenerator = new ControllerGenerator();

// let completedDevices;
// let basecontrollers;

// describe('Test the scan function for DeviceDiscovery.ts', function () {

//     afterEach(done => {
//         setTimeout(done, 100);
//     });

//     it('Should retrieve meta-data on each device', async function () {
//         try {



//             const ret = await controllerGenerator.discoverCompleteDevices().catch(e => { console.log(e) });
//             // if (ret.length != protoDevices.length) // throw new Error("Every proto-device did not retrieve meta-data successfully");
//             completedDevices = ret;
//         } catch (error) {
//             console.log(error)
//         }
//     })

//     it('Should create a controller for each device', function () {
//         try {


//             const ret = controllerGenerator.generateControllers(completedDevices);
//             // if (ret.length != protoDevices.length) // throw new Error("Every proto-device did not retrieve meta-data successfully");
//             basecontrollers = ret;

//         } catch (error) {
//             console.log(error)
//             return
//         }
//     })
//     // it('turn on a light', async function () {
//     //     if (basecontrollers.has("DC4F22CF7C31")) {
//     //     // const a = basecontrollers.filter((controller: BaseController) => {
//     //     //     return controller.getCachedDeviceInformation().protoDevice.uniqueId = "DC4F22CF7C31";
//     //     // })
//     //     const a: BaseController = basecontrollers.get("DC4F22CF7C31");
//     // //     const command: IDeviceCommand = { isOn: true, RGB: { red: 255, green: 255, blue: 25 }, CCT: { warmWhite: 255, coldWhite: 255 }, colorMask: 0x0F }
//     //     await a[0].setAllValues(command)

//     //     // }
//     // })
//     it('make colors', function () {

//         try {
//             if (basecontrollers == undefined) return false;

//             const onlineDevices = basecontrollers.filter((controller: BaseController) => {
//                 // return controller.getCachedDeviceInformation().protoDevice.uniqueId == 'DC4F22CF7C31'
//                 // return controller.getCachedDeviceInformation().protoDevice.uniqueId == '2CF432B7D7C5'

//                 return true;

//                 // controller.getCachedDeviceInformation().deviceAPI

//                 // return controller.getCachedDeviceInformation().protoDevice.ipAddress == '192.168.1.7'

//                 // return controller.getCachedDeviceInformation().deviceState.isOn;

//             });

//             // console.log(onlineDevices[0].getCachedDeviceInformation().deviceAPI)
//             // console.log("ONLINE DEVICES", onlineDevices)
//             if (typeof onlineDevices == 'undefined' || !onlineDevices || onlineDevices.length < 1) {

//                 return false;
//             }
//             // const commandOptions: ICommandOptions = { waitForResponse: false, maxRetries: 5, remainingRetries: 5, commandType: COMMAND_TYPE.COLOR_COMMAND, timeoutMS: 50, isEightByteProtocol: false, colorAssist: true};
//             // const deviceCommand = { isOn: true, RGB: { red: 255, green: 0, blue: 255 }, CCT: { warmWhite: 0, coldWhite: 0 }, colorMask: 0xFF };


//             chatGPTAnimation.startTest(onlineDevices);
//             // onlineDevices.forEach(async (controller: BaseController) => {
    
//             //     // await controller.setAllValues(deviceCommand).then((res) => {
//             //     //     console.log("res", res)
//             //     // }).catch((err) => {
//             //     //     console.log("ERROR", err)
//             //     // });
//             //     // controller.fetchState(1000);

//             // });

//             // animationController = new AnimationController()
//             // animationController.animateAsynchronously(onlineDevices, hellStruck)
//             // await sleepTimeout(200000);
//             // animationController.clearAnimations();
//         } catch (error) {
//             console.log(error)
//             return;
//         }
//     })
// });