import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Unit} from "../model/unit/unit";
import {animateAttack, animateDamage, fadeInOut} from './animation/animation';
import {getUnitArea, pickTarget, pickTriggeredUnit} from "./helper/helper";
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ScoresComponent} from "../scores/scores.component";
import {LoginComponent} from "../login/login.component";
import {ApiService} from "../service/api";
import {v4} from 'uuid';
import {Score} from "../model/scores/score";
import {State} from "../model/state/state";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
  animations: [fadeInOut(700, 700, false)],
  providers: [NgbModalConfig, NgbModal],
})
export class SceneComponent implements OnInit {
  currentUserId: string = '';
  heroes: Unit[] = [];
  enemies: Unit[] = [];
  @ViewChildren('unit') elements!: QueryList<ElementRef>;

  constructor(config: NgbModalConfig, private modalService: NgbModal, private api: ApiService) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true
    config.size = 'lg';
  }

  ngOnInit(): void {
    this.api.state().subscribe(state => this.updateState(state))

    //this.openScoresTable()
  }

  joinGame(): void {
    const loginForm = this.modalService.open(LoginComponent);

    loginForm.componentInstance.output.subscribe((form: any) => {
      const id: string = v4();

      this.api.joinPlayer(form.username, id);
      this.currentUserId = id;

      loginForm.close();
    })
  }

  attack(): void {
    // choose alive enemy and send command to socket
    // shake trigger unit

    try {
      const enemy = pickTarget(this.enemies)
      const hero = pickTriggeredUnit(this.currentUserId, this.heroes)
      this.sendAttackCommand(enemy, hero)

      // Move to command handlers when we will have event from backend
      this.applyDamage(enemy, hero);
      this.applyAttackAnimation(hero)


    } catch (error) {
      this.modalService.open(ScoresComponent);
    }
  }

  sendAttackCommand(triggerUnit: Unit, targetUnit: Unit): void {
    console.log(triggerUnit.title + ' -> ' + targetUnit.title + ' with power ' + triggerUnit.power)
  }

  private openScoresTable(): void {
    const scores = this.modalService.open(ScoresComponent);

    const scoresData: Score[] = [];

    scores.componentInstance.scores = scoresData;
  }

  private applyAttackAnimation(unit: Unit): void {
    const area = getUnitArea(unit, this.elements);
    const animation = animateAttack();

    area.nativeElement.animate(animation.transitions, animation.params);
  }

  private applyDamage(enemy: Unit, hero: Unit) {
    const healthRest = enemy.health - hero.power;
    enemy.health = healthRest <= 0 ? 0 : healthRest;

    const area = getUnitArea(enemy, this.elements);
    const animation = animateDamage();

    area.nativeElement.animate(animation.transitions, animation.params);
  }

  private updateState(state: State) {
    // No replace -> update

    const updateEnemy = (enemy: Unit) => {
      this.enemies.push(new Unit(enemy.id, enemy.health, enemy.power, enemy.title, enemy.avatar))
    }

    const updateHero = (hero: Unit) => {
      this.heroes.push(new Unit(hero.id, hero.health, hero.power, hero.title, hero.avatar))
    }

    this.enemies = [];
    this.heroes = [];

    state.enemies.forEach(enemy => updateEnemy(enemy));
    state.heroes.forEach(hero => updateHero(hero));

    console.log(state)
  }
}
