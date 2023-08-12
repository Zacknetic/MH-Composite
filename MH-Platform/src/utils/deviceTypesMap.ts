import { IDeviceAPI } from './types';

export const deviceTypesMap: Map<number, IDeviceAPI> = new Map([
  [
    0x04,
    {
      description: 'RGBW Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww'],
      simultaneousCCT: true,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: true,
      needsPowerCommand: false,
    },
  ],
  [
    0x06,
    {
      description: 'RGBW Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww'],
      simultaneousCCT: true,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0x07,
    {
      description: 'RGBWW Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww', 'cw'],
      simultaneousCCT: true,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: false,
      needsPowerCommand: null,
    },
  ],
  [
    0x09,
    {
      description: 'CCT Strip',
      byteOrder: ['ww', 'cw'],
      simultaneousCCT: false,
      hasColor: false,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: false,
      needsPowerCommand: null,
    },
  ],
  [
    0x21,
    {
      description: 'Dimmer',
      byteOrder: ['r'],
      simultaneousCCT: false,
      hasColor: false,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0x25,
    {
      description: 'RGBWW Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww', 'cw'],
      simultaneousCCT: true,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: false,
      needsPowerCommand: null,
    },
  ],
  [
    0x33,
    {
      description: 'GRB Strip',
      byteOrder: ['g', 'r', 'b'],
      simultaneousCCT: false,
      hasColor: true,
      hasCCT: false,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0x35,
    {
      description: 'RGBWW Non-Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww', 'cw'],
      simultaneousCCT: false,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: false,
      needsPowerCommand: null,
    },
  ],
  [
    0x41,
    {
      description: 'Dimmer',
      byteOrder: ['r'],
      simultaneousCCT: false,
      hasColor: false,
      hasCCT: false,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0x44,
    {
      description: 'RGBW Non-Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww'],
      simultaneousCCT: false,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: true,
      needsPowerCommand: null,
    },
  ],
  [
    0x52,
    {
      description: 'RGBWW Non-Simultaneous',
      byteOrder: ['r', 'g', 'b', 'ww', 'cw'],
      simultaneousCCT: false,
      hasColor: true,
      hasCCT: true,
      hasBrightness: true,
      isEightByteProtocol: false,
      needsPowerCommand: null,
    },
  ],
  [
    0x65,
    {
      description: 'Dimmer',
      byteOrder: ['r'],
      simultaneousCCT: false,
      hasColor: false,
      hasCCT: false,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0x93,
    {
      description: 'Power Socket',
      byteOrder: [],
      simultaneousCCT: false,
      hasColor: false,
      hasCCT: false,
      hasBrightness: false,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0x97,
    {
      description: 'Power Socket',
      byteOrder: [],
      simultaneousCCT: false,
      hasColor: false,
      hasCCT: false,
      hasBrightness: false,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0xa1,
    {
      description: 'RGB Strip',
      byteOrder: ['r', 'g', 'b'],
      simultaneousCCT: false,
      hasColor: true,
      hasCCT: false,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
  [
    0xa2,
    {
      description: 'RGB Strip',
      byteOrder: ['r', 'g', 'b'],
      simultaneousCCT: false,
      hasColor: true,
      hasCCT: false,
      hasBrightness: true,
      isEightByteProtocol: null,
      needsPowerCommand: null,
    },
  ],
]);

export const matchingFirmwareVersions: Map<number, any> = new Map([
  [1, { needsPowerCommand: false, isEightByteProtocol: true }],
  [2, { needsPowerCommand: true }],
  [3, { needsPowerCommand: true, isEightByteProtocol: true }],
  [4, { needsPowerCommand: true }],
  [5, { needsPowerCommand: true }],
  [7, { needsPowerCommand: false, isEightByteProtocol: false }],
  [8, { needsPowerCommand: true, isEightByteProtocol: true }],
  [9, { needsPowerCommand: false, isEightByteProtocol: true }],
])

export function getUniqueIdName(uniqueId: string, controllerLogicType: string | null): string {
  const uniqueIdTruc = uniqueId.slice(-6);
  let deviceType = 'LED';
  if (controllerLogicType) {
    if (isType(controllerLogicType, 'bulb')) {
      deviceType = 'Bulb';
    } else if (isType(controllerLogicType, 'strip')) {
      deviceType = 'Strip';
    } else if (isType(controllerLogicType, 'switch')) {
      deviceType = 'Switch';
    }
  }
  return `${deviceType} ${uniqueIdTruc}`;
}

function isType(a, b) {
  return a.toLowerCase().indexOf(b) > -1;
}