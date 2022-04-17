import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectManagementService {
  private addSingleProjectURL = 'http://localhost:3000/project/add-single';
  private getProjectURL = 'http://localhost:3000/project/get';
  private getUserURL = 'http://localhost:3000/project/get-user';
  private updateProjectURL = 'http://localhost:3000/project/update';
  private deleteProjectURL = 'http://localhost:3000/project/delete';
  constructor(private http: HttpClient) {}

  addSingleProject(projects: {}) {
    return this.http.post<any>(this.addSingleProjectURL, projects);
  }
  getProjects() {
    return this.http.get<any>(this.getProjectURL);
  }
  getUsers() {
    return this.http.get<any>(this.getUserURL);
  }
  updateProject(projectData: {}) {
    console.log(projectData);
    return this.http.put<any>(this.updateProjectURL, projectData);
  }

  deleteProjects(projectID: any) {
    console.log(projectID);
    return this.http.post<any>(
      this.deleteProjectURL + '?action=delete',
      projectID
    );
  }
}
