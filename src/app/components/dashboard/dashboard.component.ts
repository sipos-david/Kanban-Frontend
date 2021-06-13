import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { HealthService } from 'src/app/core/services/health.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { Project } from 'src/app/shared/models/project.model';
import { User } from 'src/app/shared/models/user.model';
import { ProjectService } from 'src/app/shared/services/project.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ProjectAddDialogComponent } from '../dialogs/project-add-dialog/project-add-dialog.component';
import { ProjectAddDialogData } from '../dialogs/project-add-dialog/project-add-dialog.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private projectService: ProjectService,
    private authService: AuthService,
    private userService: UserService,
    private healthService: HealthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  user: User = { id: '', name: '' };
  projects: Project[] = [];
  userProjects: Project[] = [];
  isLoggedIn = false;
  isSearchEnabled = false;
  serverStatus: string | undefined;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn;
    if (this.isLoggedIn) {
      this.getData();
    }

    this.authService.userLoginEvent.subscribe((success) => {
      this.isLoggedIn = success;
      if (success) {
        this.getProjects();
      }
    });
    this.authService.userLoadProfileEvent.subscribe(() => this.getData());

    this.isSearchEnabled = this.settingsService.searchEnabled;
    this.settingsService.searchEnabledChangeEvent.subscribe(
      (isSearchEnabled) => (this.isSearchEnabled = isSearchEnabled)
    );

    this.healthService
      .getApiHealth()
      .subscribe((health) => (this.serverStatus = health));
  }

  public viewProject(project: Project): void {
    this.router.navigate(['projects', project.id]);
  }

  private getData(): void {
    this.getUser();
    this.getProjects();
  }

  private getProjects(): void {
    this.projectService.getProjects().subscribe((p) => {
      this.projects = p;
      this.userProjects = this.projects.filter((project) =>
        project.users.find((u) => u.id === this.user.id)
      );
    });
  }

  private getUser(): void {
    const id = this.authService.userId;
    const name = this.authService.userName;
    if (id && name) {
      this.user = { id, name };
    }
  }

  public onAddProject(): void {
    const data = new ProjectAddDialogData();
    data.project = { id: undefined, name: '', users: [], tables: [] };
    data.currentUser = this.user;
    this.userService.getUsers().subscribe((users) => {
      data.users = users;
      const dialogRef = this.dialog.open(ProjectAddDialogComponent, {
        data,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.projectService
            .addProject(result.project)
            .subscribe(() => this.getProjects());
        }
      });
    });
  }
}
