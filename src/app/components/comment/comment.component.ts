import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Comment } from 'src/app/shared/models/comment.model';
import { SimpleAddDialogData } from '../dialogs/simple-add-dialog/simple-add-dialog-data.model';
import { SimpleAddDialogComponent } from '../dialogs/simple-add-dialog/simple-add-dialog.component';
import { SimpleDialogComponent } from '../dialogs/simple-dialog/simple-dialog.component';
import { SimpleDialogData } from '../dialogs/simple-dialog/simple-dialog.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  @Input() public data: Comment | undefined;

  ngOnInit(): void {}

  public onDeleteComment(): void {
    const data = new SimpleDialogData();
    data.title = 'Delete comment';
    data.subtitle = 'Are you sure you want to remove this comment?';
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleDialogData) => {
      if (result) {
        console.log('delete comment');
        // TODO: comment delete from task
      }
    });
  }

  public onEditComment(): void {
    const data = new SimpleAddDialogData();
    data.title = 'Edit comment';
    data.subtitle = 'Please edit the comment:';
    data.placeholder = 'New text...';
    data.text = this.data?.text;
    const dialogRef = this.dialog.open(SimpleAddDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result: SimpleAddDialogData) => {
      if (result && result.text && result.text !== '' && this.data != null) {
        this.data.text = result.text;
        // TODO: edit comment on server
      }
    });
  }
}
