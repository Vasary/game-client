import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Team, Unit} from "../model/unit/unit";
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
  player: Unit | null;
  gameOver: boolean = false;
  units: Unit[] = [];

  @ViewChildren('unit') elements!: QueryList<ElementRef>;

  constructor(config: NgbModalConfig, private modalService: NgbModal, private api: ApiService) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true
    config.size = 'lg';
    this.player = null;
  }

  ngOnInit(): void {
    this.api.player().subscribe(player => this.player = player)
    this.api.state().subscribe(state => this.updateState(state))

    this.api.fightEvents().subscribe(fightEvent => {
      this.applyDamage(fightEvent);
      this.applyAttackAnimation(fightEvent.trigger)

    })
    this.api.scores().subscribe(scores => {
      this.openScoresTable(scores);
      this.gameOver = true;
      this.player = null;
    })
  }

  joinGame(): void {
    const loginForm = this.modalService.open(LoginComponent);

    loginForm.componentInstance.output.subscribe((form: any) => {
      this.api.joinPlayer(form.username, v4());
      loginForm.close();
    })
  }

  attack(): void {
    this.api.triggerAttack()
  }

  private openScoresTable(scores: Score[]): void {
    const scoresComponent = this.modalService.open(ScoresComponent);

    scoresComponent.componentInstance.scores = scores;
  }

  private applyAttackAnimation(unit: Unit): void {
    const area = getUnitArea(unit, this.elements);
    const animation = animateAttack();

    area.nativeElement.animate(animation.transitions, animation.params);
  }

  private applyDamage(event: any) {
    const targets = this.units.filter(e => e.id === event.target.id)
    if (targets.length === 0 || targets.length > 1) {
      throw new Error('Invalid target')
    }

    targets[0].applyDamage(event.attackPower)

    const area = getUnitArea(event.target, this.elements);
    const animation = animateDamage();

    area.nativeElement.animate(animation.transitions, animation.params);
  }

  private updateState(state: State) {
    let checkedId: string[] = [];
    const updateUnit = (updated: Unit, list: Unit[], team: Team) => {
      const unit = list.filter(u => u.id === updated.id);

      if (unit.length === 0) {
        const unit: Unit = new Unit(updated.id, updated.health, updated.power, updated.title, updated.avatar, team);

        list.push(unit)
      } else {
        unit[0].health = updated.health;
        unit[0].power = updated.power;
        unit[0].title = updated.title;
        unit[0].avatar = updated.avatar;
      }
    }

    const updateList = (states: Unit[], list: Unit[], team: Team) => {
      for (let hero of states) {
        updateUnit(hero, list, team)
        checkedId.push(hero.id)
      }
    }

    updateList(state.heroes, this.units, 'Heroes')
    updateList(state.enemies, this.units, 'Villains')

    for (const stageHero of this.units) {
      if (!checkedId.includes(stageHero.id)) {
        const position = this.units.findIndex(u => u.id === stageHero.id);

        if (position > -1) {
          this.units.splice(position, 1);
        }
      }
    }
  }

  get villains(): Unit[] {
    return this.units.filter(u => u.team === 'Villains');
  }


  get heroes(): Unit[] {
    return this.units.filter(u => u.team === 'Heroes');
  }
}
