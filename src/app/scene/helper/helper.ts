import {Unit} from "../../model/unit/unit";
import {ElementRef, QueryList} from "@angular/core";

export const pickTarget = (enemies: Unit[]): Unit => {
  const aliveEnemies = enemies.filter(e => e.health > 0);

  if (aliveEnemies.length === 0) {
    throw new Error('All of enemies are dead')
  }

  return aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
}

export const pickTriggeredUnit = (id: string, heroes: Unit[]): Unit => {
  const heroesInGame = heroes.filter(e => e.id === id);

  if (heroesInGame.length !== 1) {
    throw new Error('Invalid triggered unit id')
  }

  const hero: Unit = heroesInGame[0];

  if (hero.health <= 0) {
    throw new Error('Hero is isDied');
  }

  return hero;
}

export const getUnitArea = (unit: Unit, elements: QueryList<ElementRef>): ElementRef => {
  const unitElement = elements.filter(e => e.nativeElement.getAttribute('data-unit-id') === unit.id)

  if (unitElement.length === 1) {
    return unitElement[0]
  }

  throw new Error('Element area not found');
}
