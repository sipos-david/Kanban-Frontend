import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/shared/models/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  constructor() {}

  @Input() public data: Comment | undefined;

  ngOnInit(): void {}

  public onDeleteComment(): void {}

  public onEditComment(): void {}
}
