import { IAnimationBlueprint, IAnimationLoop } from "../utils/types";
import { InterpolationType } from "./animationUtils";

export const raining: IAnimationBlueprint = {
    name: "raining",
    priority: 9,
    syncSequenceTimings: false,
    syncSequenceColor: false,
    lightOffsetDurationMS: 0,
    animationSequences: [
        {
            targetColor: {
                red: 0,
                green: [0, 2],
                blue: [0, 5],
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 1000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN_SINE,
            skipChance: 0,
        },
    ]
}

export const rainbow: IAnimationBlueprint = {
    name: "rainbow",
    priority: 9,
    syncSequenceTimings: false,
    syncSequenceColor: true,
    lightOffsetDurationMS: 0,
    animationSequences: [
        {
            targetColor: {
                red: 255,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 5000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN,
            skipChance: 0,
        },
        {
            targetColor: {
                red: 255,
                green: 255,
                blue: 0,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 5000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN,
            skipChance: 0,
        },
        {
            targetColor: {
                red: 0,
                green: 255,
                blue: 0,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 5000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN,
            skipChance: 0,
        },
        {
            targetColor: {
                red: 0,
                green: 255,
                blue: 255,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 5000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN,
            skipChance: 0,
        },
        {
            targetColor: {
                red: 0,
                green: 0,
                blue: 255,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 5000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN,
            skipChance: 0,
        },
        {
            targetColor: {
                red: 255,
                green: 0,
                blue: 255,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 5000,
            durationAtTargetMS: 100,
            interpolationType: InterpolationType.EASE_IN,
            skipChance: 0,
        }
    ]
}

export const thunderStruck: IAnimationBlueprint = {
    name: "thunderStruck",
    priority: 1,
    syncSequenceTimings: false,
    syncSequenceColor: false,
    lightOffsetDurationMS: 0,
    animationSequences: [
        {
            targetColor: {
                red: 0,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: 0,
            durationAtTargetMS: [2000, 3000],
            interpolationType: InterpolationType.LINEAR,
            skipChance: 0,
        },
        {
            startColor: {
                red: 0,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 200,
            },
            targetColor: {
                red: 0,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 200,
            },
            transitionDurationMS: 0,
            durationAtTargetMS: 300,
            interpolationType: InterpolationType.LINEAR,
            skipChance: 0,
        },
        {
            targetColor: {
                red: 0,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 0,
            },
            transitionDurationMS: [300, 450],
            durationAtTargetMS: [100, 150],
            interpolationType: InterpolationType.LINEAR,
            skipChance: 0,
        },
        {
            startColor: {
                red: 0,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 0,
            },
            targetColor: {
                red: 0,
                green: 0,
                blue: 0,
                warmWhite: 0,
                coldWhite: 255,
            },
            transitionDurationMS: 50,
            durationAtTargetMS: 500,
            interpolationType: InterpolationType.LINEAR,
            skipChance: 60,
        }

    ]
}



// export const thunderStruck: IAnimationLoop = {

//     'name': 'ThunderStruck',
//     'pattern': [
//         {
//             'colorStart': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

//             },
//             'colorTarget': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
//             },
//             'transitionTimeMS': 50,
//             'durationAtTargetMS': 50,
//             'chancePercent': 50,
//         },
//         {
//             'colorStart': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

//             },
//             'colorTarget': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
//             },
//             'transitionTimeMS': 50,
//             'durationAtTargetMS': 100,
//             'chancePercent': 100,
//         },
//         {
//             'colorStart': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

//             },
//             'colorTarget': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
//             },
//             'transitionTimeMS': 50,
//             'durationAtTargetMS': 50,
//             'chancePercent': 100,
//         },
//         {
//             'colorStart': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

//             },
//             'colorTarget': {
//                 RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
//             },
//             'transitionTimeMS': 500,
//             'durationAtTargetMS': [5000, 10000],
//             'chancePercent': 100,
//         },
//     ],
//     'accessoryOffsetMS': 0,
// };

export const hellStruck: IAnimationLoop = {

    'name': 'HellStruck',
    'pattern': [
        {
            'colorStart': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 50,
            'durationAtTargetMS': 100,
            'chancePercent': 50,
        },
        {
            'colorStart': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 50,
            'durationAtTargetMS': 100,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1,
            'durationAtTargetMS': 100,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 10, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 500,
            'durationAtTargetMS': [1000, 3000],
            'chancePercent': 100,
        },
    ],
    'accessoryOffsetMS': 0,
};

export const colorWave: IAnimationLoop = {

    'name': 'colorWave',
    'pattern': [
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 127, green: 127, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': 300,
            'chancePercent': 20,
        },
        {
            'colorStart': {
                RGB: { red: 127, green: 127, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 255, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': 300,
            'chancePercent': 20,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 255, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 127, blue: 127 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': 300,
            'chancePercent': 20,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 127, blue: 127 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 255 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': 300,
            'chancePercent': 20,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 255 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 127, green: 0, blue: 127 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': 300,
            'chancePercent': 20,
        },
        {
            'colorStart': {
                RGB: { red: 127, green: 0, blue: 127 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': 300,
            'chancePercent': 20,
        },
    ],
    'accessoryOffsetMS': 1000,
};

export const cctWave: IAnimationLoop = {

    'name': 'cctWave',
    'pattern': [
        {
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 255 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 255 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 0,
            'chancePercent': 100,
        },
    ],
    'accessoryOffsetMS': 0,
};

export const cctColorWave: IAnimationLoop = {

    'name': 'cctColorWave',
    'pattern': [
        {
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 200,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 127, green: 127, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 200,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 255, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 200,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 127, blue: 127 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 200,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 255 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 200,
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 127, green: 0, blue: 127 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 1000,
            'durationAtTargetMS': 200,
            'chancePercent': 100,
        },
    ],
    'accessoryOffsetMS': 0,
};

export const cctRgbTest: IAnimationLoop = {

    'name': 'cctRgbTest',
    'pattern': [
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 500,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 500,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 500,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 500,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 0,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 0,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 255, coldWhite: 0 },
            },
            'transitionTimeMS': 0,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 0,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },
    ],
    'accessoryOffsetMS': 0,
};

export const colorTest: IAnimationLoop = {

    'name': 'colorTest',
    'pattern': [
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 255, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },

        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 255, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },

        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },

            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 255 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 3000,
            'durationAtTargetMS': 3000,
            'chancePercent': 100,
        },
    ],
    'accessoryOffsetMS': 6000,
};
export const hell: IAnimationLoop = {

    'name': 'hell',
    'pattern': [
        {
            'colorTarget': {
                RGB: { red: [100, 255], green: [0, 25], blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': [200, 300],
            'durationAtTargetMS': [0, 2000],
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 255, green: 255, blue: 255 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'colorTarget': {
                RGB: { red: [100, 255], green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': [100, 150],
            'chancePercent': 10,
        },
    ],
    'accessoryOffsetMS': 0,
};

export const fireworks: IAnimationLoop = {

    'name': 'fireworks',
    'pattern': [
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'colorTarget': {
                RGB: { red: [100, 255], green: [25, 50], blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': [100, 150],
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: [150, 200], green: [150, 200], blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': [100, 150],
            'chancePercent': 100,
        },
        {
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 255 },
            },
            'transitionTimeMS': 200,
            'durationAtTargetMS': [500, 2000],
            'chancePercent': 100,
        },
        {
            'colorStart': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'colorTarget': {
                RGB: { red: 0, green: 0, blue: 0 }, CCT: { warmWhite: 0, coldWhite: 0 },
            },
            'transitionTimeMS': 750,
            'durationAtTargetMS': [1000, 2000],
            'chancePercent': 100,
        },
    ],
    'accessoryOffsetMS': 0,
};