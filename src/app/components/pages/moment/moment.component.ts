import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { CommentService } from 'src/app/services/coment.service';

import { Moment } from 'src/app/Moment';
import { Comment } from 'src/app/Comment';

import { environment } from 'src/environments/environment';

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit {

  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;

  faTimes = faTimes;
  faEdit = faEdit;

  comentForm!: FormGroup

  constructor(
    private momentService: MomentService, 
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {

    //id que está na URL

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService
    .getMoment(id)
    .subscribe((item) => (this.moment = item.data));

    this.comentForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required]),
    })
  }

  get text() {
    return this.comentForm.get('text')!;
  }

  get username() {
    return this.comentForm.get('username')!;
  }

  async removeHandler(id: number) {
    await this.momentService.removeMoment(id).subscribe();

    this.messagesService.add(`Momento excluido com sucesso!`);

    this.router.navigate(['/']);
  }

  async onSubmit(formDirective: FormGroupDirective) {

    if(this.comentForm.invalid) {
      return;
    }

    const data: Comment = this.comentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService
    .createComment(data)
    .subscribe((comment) => this.moment!.comments!.push(comment.data));

    this.messagesService.add("Comentário adicionado!");

    //reseta o form
    this.comentForm.reset();

    formDirective.resetForm();
  }
}
