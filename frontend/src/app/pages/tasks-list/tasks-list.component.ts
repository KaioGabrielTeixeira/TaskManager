import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from '../../services/task.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

// IMPORTS DO ANGULAR MATERIAL:
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    // ADICIONE OS MÓDULOS DO MATERIAL AQUI:
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks: any[] = [];
  userName: string = '';
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskStatus: string = 'pendente';
  newTaskDueDate: Date | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userName = decoded.nome; // Use o campo correto do seu token
    }

    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => alert('Erro ao buscar tarefas: ' + (err.error?.message || err.statusText))
    });
  }

  createTask() {
    if (!this.newTaskTitle) return;
    const dataVencimento = this.newTaskDueDate
      ? this.newTaskDueDate.toISOString().split('T')[0]
      : undefined;
    this.taskService.createTask({
      titulo: this.newTaskTitle,
      descricao: this.newTaskDescription,
      status: this.newTaskStatus,
      data_vencimento: dataVencimento
    }).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskStatus = 'pendente';
        this.newTaskDueDate = null;
      },
      error: (err) => alert('Erro ao criar tarefa: ' + (err.error?.message || err.statusText))
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      this.snackBar.open('Logout realizado com sucesso!', 'Fechar', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  }
}