import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  constructor(private router: Router, private projectService: ProjectService) {}

  projects: Project[] = [];
  displaySearchResult = false;
  isSearchResultAvailable = false;
  query: string | undefined = undefined;

  public viewProject(project: Project): void {
    this.router.navigate(['projects', project.id]);
  }

  public search(): void {
    this.displaySearchResult = true;
    this.isSearchResultAvailable = false;
    this.projectService.getProjectsByName(this.query).subscribe((result) => {
      this.projects = result;
      this.isSearchResultAvailable = true;
    });
  }
}
