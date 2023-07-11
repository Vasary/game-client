import {animate, AnimationTriggerMetadata, style, transition, trigger} from "@angular/animations";

export function fadeInOut(timingIn: number, timingOut: number, height: boolean = false): AnimationTriggerMetadata  {
  return trigger('fadeInOut', [
    transition(':enter', [
      style(height ? { opacity: 0 , height: 0, } : { opacity: 0, }),
      animate(timingIn, style(height ? { opacity: 1, height: 'fit-content' } : { opacity: 1, })),
    ]),
    transition(':leave', [
      animate( timingOut, style(height ? { opacity: 0, height: 0, } : { opacity: 0, })),
    ])
  ]);
}

export function animateAttack(): any
{
  return {
    transitions: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(1)' }
    ],
    params: {
      duration: 200,
      iterations: 1,
    }
  }
}

export function animateDamage(): any
{
  return {
    transitions: [
      {transform: 'rotate(0)'},
      {transform: 'rotate(5deg)'},
      {transform: 'rotate(-5deg)'},
      {transform: 'rotate(0)'},
    ],
    params: {
      duration: 200,
      iterations: 3,
    }
  }
}
