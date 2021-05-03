import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Project } from 'src/app/shared/models/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private projectService: ProjectService
  ) {}

  project: Project | undefined;

  ngOnInit(): void {
    this.getProject();
  }

  getProject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService
        .getProject(+id)
        .subscribe((project) => (this.project = project));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
