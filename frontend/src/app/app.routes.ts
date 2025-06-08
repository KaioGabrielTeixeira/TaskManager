import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'tasks', component: TasksListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];