import {animate, AnimationTriggerMetadata, style, transition, trigger} from "@angular/animations";

export function fadeInOut(timingIn: number, timingOut: number, height: boolean = false): AnimationTriggerMetadata {
  return trigger('fadeInOut', [
    transition(':enter', [
      style(height ? {opacity: 0, height: 0,} : {opacity: 0,}),
      animate(timingIn, style(height ? {opacity: 1, height: 'fit-content'} : {opacity: 1,})),
    ]),
    transition(':leave', [
      animate(timingOut, style(height ? {opacity: 0, height: 0,} : {opacity: 0,})),
    ])
  ]);
}

export function animateAttack(): any {
  return {
    transitions: [
      {transform: 'translateX(-6rem)'},
      {transform: 'scale(1.1)'},
      {transform: 'scale(1)'},
      {transform: 'translateX(  0rem)'},
    ],
    params: {
      duration: 350,
      iterations: 1,
    }
  }
}

export function animateDamage(): any {
  return {
    transitions: [
      {transform: 'rotate(0)'},
      {transform: 'scale(1.05)'},
      {transform: 'translateX(.25rem)'},
      {transform: 'translateX(-.25rem)'},
      {transform: 'scale(1)'},
      {transform: 'rotate(0)'},
    ],
    params: {
      duration: 200,
      iterations: 3,
    }
  }
}
