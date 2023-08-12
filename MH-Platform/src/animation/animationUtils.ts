import { IAnimationColorStep, IAnimationSequenceStep } from "..";


export function interpolate(start: number, end: number, current: number, total: number, type: InterpolationType) {
    if (type === InterpolationType.LINEAR) {
      return start + (end - start) * current / total;
    } else if (type === 'easeIn') {
      return start + (end - start) * Math.pow(current / total, 2);
    } else if (type === 'easeOut') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 2));
    } else if (type === 'easeInOut') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 2)) / 2;
    } else if (type === 'easeOutIn') {
      return start + (end - start) * Math.pow(current / total, 2) / 2;
    } else if (type === 'easeInCubic') {
      return start + (end - start) * Math.pow(current / total, 3);
    } else if (type === 'easeOutCubic') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 3));
    } else if (type === 'easeInOutCubic') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 3)) / 2;
    } else if (type === 'easeOutInCubic') {
      return start + (end - start) * Math.pow(current / total, 3) / 2;
    } else if (type === 'easeInQuart') {
      return start + (end - start) * Math.pow(current / total, 4);
    } else if (type === 'easeOutQuart') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 4));
    } else if (type === 'easeInOutQuart') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 4)) / 2;
    } else if (type === 'easeOutInQuart') {
      return start + (end - start) * Math.pow(current / total, 4) / 2;
    } else if (type === 'easeInQuint') {
      return start + (end - start) * Math.pow(current / total, 5);
    } else if (type === 'easeOutQuint') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 5));
    } else if (type === 'easeInOutQuint') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 5)) / 2;
    } else if (type === 'easeOutInQuint') {
      return start + (end - start) * Math.pow(current / total, 5) / 2;
    } else if (type === 'easeInSine') {
      return start + (end - start) * (1 - Math.cos(current / total * (Math.PI / 2)));
    } else if (type === 'easeOutSine') {
      return start + (end - start) * Math.sin(current / total * (Math.PI / 2));
    } else if (type === 'easeInOutSine') {
      return start + (end - start) * (1 - Math.cos(current / total * Math.PI)) / 2;
    } else if (type === 'easeOutInSine') {
      return start + (end - start) * Math.sin(current / total * Math.PI) / 2;
    } else if (type === 'easeInExpo') {
      return start + (end - start) * Math.pow(2, 10 * (current / total - 1));
    } else if (type === 'easeOutExpo') {
      return start + (end - start) * (1 - Math.pow(2, -10 * current / total));
    } else if (type === 'easeInOutExpo') {
      return start + (end - start) * (1 - Math.pow(2, -10 * current / total)) / 2;
    } else if (type === 'easeOutInExpo') {
      return start + (end - start) * Math.pow(2, 10 * (current / total - 1)) / 2;
    } else if (type === 'easeInCirc') {
      return start + (end - start) * (1 - Math.sqrt(1 - Math.pow(current / total, 2)));
    } else if (type === 'easeOutCirc') {
      return start + (end - start) * Math.sqrt(1 - Math.pow(current / total - 1, 2));
    } else if (type === 'easeInOutCirc') {
      return start + (end - start) * (1 - Math.sqrt(1 - Math.pow(current / total, 2))) / 2;
    } else if (type === 'easeOutInCirc') {
      return start + (end - start) * Math.sqrt(1 - Math.pow(current / total - 1, 2)) / 2;
    } else if (type === 'easeInBack') {
      return start + (end - start) * (current / total) * (current / total) * ((1.70158 + 1) * current / total - 1.70158);
    } else if (type === 'easeOutBack') {
      return start + (end - start) * ((current = current / total - 1) * current * ((1.70158 + 1) * current + 1.70158) + 1);
    } else if (type === 'easeInOutBack') {
      return start + (end - start) * (1 - Math.pow(1 - current / total, 2)) / 2;
    } else if (type === 'easeOutInBack') {
      return start + (end - start) * Math.pow(current / total, 2) / 2;
    } else if (type === 'easeInElastic') {
      return start + (end - start) * Math.pow(2, 10 * (current / total - 1)) * Math.cos((current / total - 1.075) * (2 * Math.PI) / 0.3);
    } else if (type === 'easeOutElastic') {
      return start + (end - start) * (1 - Math.pow(2, -10 * current / total)) * Math.cos((current / total - 0.075) * (2 * Math.PI) / 0.3) + 1;
    } else if (type === 'easeInOutElastic') {
      return start + (end - start) * (1 - Math.pow(2, -10 * current / total)) * Math.cos((current / total - 0.075) * (2 * Math.PI) / 0.3) / 2;
    } else if (type === 'easeOutInElastic') {
      return start + (end - start) * Math.pow(2, 10 * (current / total - 1)) * Math.cos((current / total - 1.075) * (2 * Math.PI) / 0.3) / 2;
    } else if (type === 'easeInBounce') {
      return start + (end - start) - easeOutBounce(end - start, total - current, 0, end - start, total);
    } else if (type === 'easeOutBounce') {
      if ((current /= total) < (1 / 2.75)) {
        return start + (end - start) * (7.5625 * current * current);
      } else if (current < (2 / 2.75)) {
        return start + (end - start) * (7.5625 * (current -= (1.5 / 2.75)) * current + 0.75);
      } else if (current < (2.5 / 2.75)) {
        return start + (end - start) * (7.5625 * (current -= (2.25 / 2.75)) * current + 0.9375);
      } else {
        return start + (end - start) * (7.5625 * (current -= (2.625 / 2.75)) * current + 0.984375);
      }
    } else if (type === 'easeInOutBounce') {
      if (current < total / 2) {
        return easeInBounce(start, current * 2, 0, end - start, total) * 0.5 + start;
      } else {
  
        return easeOutBounce(start + (end - start) / 2, current * 2 - total, 0, end - start, total) * 0.5 + start + (end - start) / 2;
      }
    } else if (type === 'easeOutInBounce') {
      if (current < total / 2) {
        return easeOutBounce(start, current * 2, 0, end - start, total) * 0.5 + start;
      } else {
        return easeInBounce(start + (end - start) / 2, current * 2 - total, 0, end - start, total) * 0.5 + start + (end - start) / 2;
      }
    } else {
      return start + (end - start) * current / total;
    }
  }
  
  function easeOutBounce(start: number, current: number, unknown: number, end: number, total: number) {
    if ((current /= total) < (1 / 2.75)) {
      return start + (end - start) * (7.5625 * current * current);
    } else if (current < (2 / 2.75)) {
      return start + (end - start) * (7.5625 * (current -= (1.5 / 2.75)) * current + 0.75);
    } else if (current < (2.5 / 2.75)) {
      return start + (end - start) * (7.5625 * (current -= (2.25 / 2.75)) * current + 0.9375);
    } else {
      return start + (end - start) * (7.5625 * (current -= (2.625 / 2.75)) * current + 0.984375);
    }
  }
  
  function easeInBounce(start: number, current: number, unknown: number, end: number, total: number) {
    return start + (end - start) - easeOutBounce(end - start, total - current, 0, end - start, total);
  }
  
  export enum InterpolationType {
    LINEAR = "linear",
    EASE_IN = "easeIn",
    EASE_OUT = "easeOut",
    EASE_IN_OUT = "easeInOut",
    EASE_OUT_IN = "easeOutIn",
    EASE_IN_SINE = "easeInSine",
    EASE_OUT_SINE = "easeOutSine",
    EASE_IN_OUT_SINE = "easeInOutSine",
    EASE_OUT_IN_SINE = "easeOutInSine",
    EASE_IN_QUAD = "easeInQuad",
    EASE_OUT_QUAD = "easeOutQuad",
    EASE_IN_OUT_QUAD = "easeInOutQuad",
    EASE_OUT_IN_QUAD = "easeOutInQuad",
    EASE_IN_CUBIC = "easeInCubic",
    EASE_OUT_CUBIC = "easeOutCubic",
    EASE_IN_OUT_CUBIC = "easeInOutCubic",
    EASE_OUT_IN_CUBIC = "easeOutInCubic",
    EASE_IN_QUART = "easeInQuart",
    EASE_OUT_QUART = "easeOutQuart",
    EASE_IN_OUT_QUART = "easeInOutQuart",
    EASE_OUT_IN_QUART = "easeOutInQuart",
    EASE_IN_QUINT = "easeInQuint",
    EASE_OUT_QUINT = "easeOutQuint",
    EASE_IN_OUT_QUINT = "easeInOutQuint",
    EASE_OUT_IN_QUINT = "easeOutInQuint",
    EASE_IN_EXPO = "easeInExpo",
    EASE_OUT_EXPO = "easeOutExpo",
    EASE_IN_OUT_EXPO = "easeInOutExpo",
    EASE_OUT_IN_EXPO = "easeOutInExpo",
    EASE_IN_CIRC = "easeInCirc",
    EASE_OUT_CIRC = "easeOutCirc",
    EASE_IN_OUT_CIRC = "easeInOutCirc",
    EASE_OUT_IN_CIRC = "easeOutInCirc",
    EASE_IN_BACK = "easeInBack",
    EASE_OUT_BACK = "easeOutBack",
    EASE_IN_OUT_BACK = "easeInOutBack",
    EASE_OUT_IN_BACK = "easeOutInBack",
    EASE_IN_ELASTIC = "easeInElastic",
    EASE_OUT_ELASTIC = "easeOutElastic",
    EASE_IN_OUT_ELASTIC = "easeInOutElastic",
    EASE_OUT_IN_ELASTIC = "easeOutInElastic",
    EASE_IN_BOUNCE = "easeInBounce",
    EASE_OUT_BOUNCE = "easeOutBounce",
    EASE_IN_OUT_BOUNCE = "easeInOutBounce",
    EASE_OUT_IN_BOUNCE = "easeOutInBounce"
  }
  
  export function recursiveArrayToInt<Type>(objOne, objTarget = {}): Type {
    for (var k in objOne) {
        if (typeof objOne[k] == "object" && objOne[k] !== null && !Array.isArray(objOne[k])) {
            objTarget[k] = {};
            objTarget[k] = recursiveArrayToInt(objOne[k], objTarget[k]);
        } else if (Array.isArray(objOne[k])) {
            objTarget[k] = Math.round(Math.random() * (objOne[k][1] - objOne[k][0]) + objOne[k][0]);
        } else {
            objTarget[k] = objOne[k];
        }
    }
    return objTarget as Type;
  }
  
  export function calculateSequenceSteps(sequence: IAnimationSequenceStep, STEP_INTERVAL_MS: number): IAnimationColorStep[] {
  
    const animationSteps: IAnimationColorStep[] = [];
    const transitionFrames = sequence.transitionDurationMS / STEP_INTERVAL_MS;
    sequence.durationAtTargetMS = sequence.durationAtTargetMS || 0;
    const reverseTransitionFrames = sequence.reverseTransitionDurationMS / STEP_INTERVAL_MS;
  
    //calculate transition delta
    const transitionDelta = {};
    for (let color in sequence.targetColor) {
        transitionDelta[color] = (sequence.targetColor[color] - sequence.startColor[color]) / transitionFrames;
    }
  
    //calculate and add transition frames between start and target color
    for (let i = 0; i < transitionFrames; i++) {
        const step = {};
        for (let color in sequence.targetColor) {
            step[color] = interpolate(sequence.startColor[color], sequence.targetColor[color], i, transitionFrames, sequence.interpolationType);
        }
        animationSteps.push(step as IAnimationColorStep);
    }
  
    //calculate and add hold frames for target color
    let durationFrames = sequence.durationAtTargetMS / STEP_INTERVAL_MS;
    for (let i = 0; i < durationFrames; i++) {
        const step = {};
        for (let color in sequence.targetColor) {
            step[color] = sequence.targetColor[color];
        }
        animationSteps.push(step as IAnimationColorStep);
    }
  
  
    // calculate and add transition frames between target and start color
    for (let i = 0; i < reverseTransitionFrames; i++) {
        const step = {};
        for (let color in sequence.targetColor) {
            step[color] = interpolate(sequence.targetColor[color], sequence.startColor[color], i, reverseTransitionFrames, sequence.interpolationType);
        }
        animationSteps.push(step as IAnimationColorStep);
    }
  
    return animationSteps;
  }