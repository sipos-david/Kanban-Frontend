import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((p) => (this.projects = p));
  }

  public onLogout(): void {
    this.authService.logoutUser();
  }
}
