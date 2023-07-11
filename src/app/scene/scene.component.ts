import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Unit} from "../model/unit/unit";
import {animateAttack, animateDamage, fadeInOut} from './animation/animation';
import {getUnitArea} from "./helper/helper";
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
    this.api.fightEvents().subscribe(fightEvent => {
      this.applyDamage(fightEvent.enemy);
      this.applyAttackAnimation(fightEvent.hero)
    })
    this.api.scores().subscribe(scores => {
      console.log(scores)
      console.log('Game Over')
    })
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
    this.sendAttackCommand()
  }

  sendAttackCommand(): void {
    this.api.unitAttack()
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

  private applyDamage(enemy: Unit) {
    const area = getUnitArea(enemy, this.elements);
    const animation = animateDamage();

    area.nativeElement.animate(animation.transitions, animation.params);
  }

  private updateState(state: State) {
    const updateUnit = (updated: Unit, list: Unit[]) => {
      const unit = list.filter(u => u.id === updated.id);

      if (unit.length === 0) {
        const unit: Unit = new Unit(updated.id, updated.health, updated.power, updated.title, updated.avatar);

        list.push(unit)
      } else {
        unit[0].health = updated.health;
        unit[0].power = updated.power;
        unit[0].title = updated.title;
        unit[0].avatar = updated.avatar;
      }
    }

    const updateList = (states: Unit[], list: Unit[]) => {
      let checkedId: string[] = [];
      for (let hero of states) {
        updateUnit(hero, list)
        checkedId.push(hero.id)
      }

      for (const stageHero of list) {
        if (!checkedId.includes(stageHero.id)) {
          const position = list.findIndex(u => u.id === stageHero.id);

          if (position > -1) {
            list.splice(position, 1);
          }
        }
      }
    }

    updateList(state.heroes, this.heroes)
    updateList(state.enemies, this.enemies)
  }
}
