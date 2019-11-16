import { Component, OnInit, Input } from '@angular/core';
import { PersonListModel } from 'src/app/models/personal.model';
import { environment } from 'src/environments/environment';
import { SurveyService } from 'src/app/services/survey.service';
@Component({
  selector: 'app-avatar-show',
  templateUrl: './avatar-show.component.html',
  styleUrls: ['./avatar-show.component.scss']
})
export class AvatarShowComponent implements OnInit {

  @Input() person: PersonListModel;
  @Input() baseURL = this.survey.getBaseImageUrl();

  constructor(private survey: SurveyService) { }

  ngOnInit() {
  }

}
