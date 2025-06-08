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
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    MatMenuModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class TasksListComponent implements OnInit {
  tasks: any[] = [];
  userName: string = '';
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskStatus: string = 'pendente';
  newTaskDueDate: Date | null = null;
  filterStatus: string = '';
  filterDate: Date | null = null;
  editingTaskId: number | null = null;
  shareEmail: string = '';
  sharingTaskId: number | null = null;
  currentFilter: string = 'todas';
  filteredTasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      console.log('Token decodificado:', decoded);
      this.userName = decoded.nome || decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'Usuário');
    }

    this.taskService.getTasks({}).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
      },
      error: (err) => alert('Erro ao buscar tarefas: ' + (err.error?.message || err.statusText))
    });
  }

  createTask() {
    let dataVencimento: string | undefined = undefined;
    if (this.newTaskDueDate) {
      const year = this.newTaskDueDate.getFullYear();
      const month = String(this.newTaskDueDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.newTaskDueDate.getDate()).padStart(2, '0');
      dataVencimento = `${year}-${month}-${day}`;
    }

    this.taskService.createTask({
      titulo: this.newTaskTitle,
      descricao: this.newTaskDescription,
      status: this.newTaskStatus,
      data_vencimento: dataVencimento
    }).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskStatus = 'pendente';
        this.newTaskDueDate = null;
        this.buscarTarefas();
      },
      error: (err) => alert('Erro ao criar tarefa: ' + (err.error?.message || err.statusText))
    });
  }

  editarTask(task: any) {
    this.editingTaskId = task.id;
    this.newTaskTitle = task.titulo;
    this.newTaskDescription = task.descricao;
    this.newTaskStatus = task.status;
    this.newTaskDueDate = task.data_vencimento ? new Date(task.data_vencimento) : null;
  }

  salvarEdicao() {
    if (this.editingTaskId === null) {
      this.snackBar.open('Nenhuma tarefa selecionada para edição.', 'Fechar', { duration: 3000 });
      return;
    }
    const dataVencimento = this.newTaskDueDate
      ? `${this.newTaskDueDate.getFullYear()}-${String(this.newTaskDueDate.getMonth() + 1).padStart(2, '0')}-${String(this.newTaskDueDate.getDate()).padStart(2, '0')}`
      : undefined;

    this.taskService.updateTask(this.editingTaskId, {
      titulo: this.newTaskTitle,
      descricao: this.newTaskDescription,
      status: this.newTaskStatus,
      data_vencimento: dataVencimento
    }).subscribe({
      next: () => {
        this.editingTaskId = null;
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskStatus = 'pendente';
        this.newTaskDueDate = null;
        this.buscarTarefas();
        this.snackBar.open('Tarefa editada com sucesso!', 'Fechar', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Erro inesperado ao editar tarefa.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }

  cancelarEdicao() {
    this.editingTaskId = null;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskStatus = 'pendente';
    this.newTaskDueDate = null;
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

  aplicarFiltros() {
    this.buscarTarefas();
  }

  limparFiltros() {
    this.filterStatus = '';
    this.filterDate = null;
    this.buscarTarefas();
  }

  buscarTarefas() {
    const filtros: any = {};
    if (this.filterStatus) filtros.status = this.filterStatus;
    if (this.filterDate) filtros.data_vencimento = this.filterDate.toISOString().split('T')[0];

    this.taskService.getTasks(filtros).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
      },
      error: (err) => alert('Erro ao buscar tarefas: ' + (err.error?.message || err.statusText))
    });
  }

  confirmarDelete(task: any) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', { duration: 2000 });
          this.buscarTarefas();
        },
        error: (err) => {
          this.snackBar.open(
            err.error?.message || 'Erro inesperado ao excluir tarefa.',
            'Fechar',
            { duration: 4000 }
          );
        }
      });
    }
  }

  abrirCompartilhamento(task: any) {
    this.sharingTaskId = task.id;
    this.shareEmail = '';
  }

  compartilharTask() {
    if (!this.shareEmail || !this.sharingTaskId) return;
    this.taskService.shareTask(this.sharingTaskId, this.shareEmail).subscribe({
      next: () => {
        this.snackBar.open('Tarefa compartilhada com sucesso!', 'Fechar', { duration: 2000 });
        this.sharingTaskId = null;
        this.shareEmail = '';
      },
      error: (err) => {
        alert('Erro ao compartilhar tarefa: ' + (err.error?.message || err.statusText));
      }
    });
  }

  cancelarCompartilhamento() {
    this.sharingTaskId = null;
    this.shareEmail = '';
  }

  descompartilharTask(taskId: number, email: string) {
    this.taskService.unshareTask(taskId, email).subscribe({
      next: () => {
        this.snackBar.open('Compartilhamento removido!', 'Fechar', { duration: 2000 });
        this.buscarTarefas();
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Erro ao remover compartilhamento.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }

  filterTasks(status: string) {
    this.currentFilter = status;
    if (status === 'todas') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === status);
    }
  }
}