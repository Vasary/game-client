import {Component, Input} from '@angular/core';
import {Score} from "../model/scores/score";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {
  @Input() scores: Score[] = [];
}
