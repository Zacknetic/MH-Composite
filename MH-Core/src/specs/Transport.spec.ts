// import { Transport } from '../Transport';

// const TEST_MODE = true
// const HOST = '192.168.50.138'
// import * as types from '../types'

// const {
//     DEVICE_COMMAND_BYTES: { COMMAND_POWER_OFF, COMMAND_POWER_ON, COMMAND_QUERY_STATE },
//     COMMAND_TYPE: { POWER_COMMAND, COLOR_COMMAND, ANIMATION_FRAME, QUERY_COMMAND },
// } = types;

// const red = [0x31, 0xFF, 0x00, 0xFF, 0xFF, 0xF0, 0x0F];
// const green = [0x31, 0x00, 0xFF, 0x00, 0x00, 0xF0, 0x0F];
// const blue = [0x31, 0x00, 0x00, 0xFF, 0x00, 0xF0, 0x0F];
// // const red = [0x31, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x0F];
// // const green = [0x31, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xF0, 0x0F];
// // const blue = [0x31, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xF0, 0x0F];
// // const warmWhite = [0x31, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xF0, 0x0F];

// const power = COMMAND_POWER_ON;

// const TIMEOUT = 1000;
// let transport;
// // ; (async () => {
// // const testParams = {
// //     result: 'FAIL',
// //     timeToFail: '500'
// // }
// // transport = new Transport(HOST);

// before(done => {
//     setTimeout(done, 100);
//     console.log('test')
//     transport = new Transport(HOST);
// });
// // async function asyncMethod(byteArray, expectResponse, timeout?) {
// //     transport.quickSend(byteArray, timeout, expectResponse);
// //     return await transport.queryState(1000);
// // }

// // describe('Check input data types', () => {

// //     it('Should accept format: byteArray: number[]', () => {

// //         asyncMethod(COMMAND_QUERY_STATE, true, TIMEOUT).then((returnValue) => {
// //             console.log('Current State: ', returnValue)
// //             // assert.strictEqual((returnValue !== null), true) //TODO create real assert
// //         }).catch(err => {
// //             console.log('FATAL err', err)
// //         })


// //     })

// //     it('Should handle unsupported format', () => {
// //         asyncMethod("THIS IS A STRING WHICH IS UNSUPORTED", true, TIMEOUT).then((returnValue) => {
// //             console.log('Test return value:', returnValue)
// //         }).catch(err => {
// //             // assert(typeof err == typeof new Error())
// //             console.log('Successfully caught unsuported format')
// //         })

// //     })
// // })


// describe('Query State Test', () => {

//     it('Should return current device state', () => {
//         // transport.send(red);
//         transport.requestState(10000)
//             .then((returnValue) => {
//                 console.log('Current State: ', returnValue)
//                 // assert.strictEqual((returnValue !== null), true) //TODO create real assert
//             }).catch(err => {
//                 console.log('FATAL err', err)
//             })

//         transport.requestState(10000)
//             .then((returnValue) => {
//                 console.log('Current State: ', returnValue)
//                 // assert.strictEqual((returnValue !== null), true) //TODO create real assert
//             }).catch(err => {
//                 console.log('FATAL err', err)
//             })

//         // transport.then((returnValue) => {
//         //     console.log('Current State: ', returnValue)
//         //     tran
//         //     // assert.strictEqual((returnValue !== null), true) //TODO create real assert
//         // }   
//         // ).catch(err => {
//         //     console.log('FATAL err', err)
//         // }
//         // )


//     })

// });


// // describe('Send Command Test', () => {



// //     it('Should set the device color to red, green, blue', async function () {


// //         // asyncMethod(COMMAND_POWER_ON, false, 0).then((returnValue) => {
// //         //     console.log(returnValue)
// //         //     // setImmediate(done)
// //         // }).catch(err => {
// //         //     console.log('FATAL err', err)
// //         // })

// //         // await sleep(500)

// //         asyncMethod(blue, false, 1000).then((returnValue) => {
// //             // console.log(returnValue)
// //             // setImmediate(done)
// //         }).catch(err => {
// //             // console.log( err)
// //         })

// //         // await sleep(500)
// //         // asyncMethod(blue, false, 0).then((returnValue) => {
// //         //     console.log(returnValue)
// //         //     // setImmediate(done)
// //         //     // setImmediate(done)

// //         // }).catch(err => {
// //         //     console.log('FATAL err', err)
// //         // })
// //     })
// // });


// async function sleep(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }

// // https://www.testim.io/blog/testing-promises-using-mocha/

