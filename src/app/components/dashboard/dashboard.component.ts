import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    private router: Router
  ) {}

  name: string | undefined;
  projects: Project[] = [];
  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn;
    this.name = this.authService.userName;
    this.authService.userLoginEvent.subscribe(
      (success) => (this.isLoggedIn = success)
    );
    this.authService.userLoadProfileEvent.subscribe(
      () => (this.name = this.authService.userName)
    );

    this.projectService.getProjects().subscribe((p) => (this.projects = p));
  }

  public onLogout(): void {
    this.authService.logoutUser();
  }
}
