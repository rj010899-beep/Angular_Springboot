import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Employee Management';

  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  isEditing = false;
  errorMessage = '';

  newEmployee: Employee = { firstName: '', lastName: '', email: '' };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => { this.employees = data; },
      error: () => { this.errorMessage = 'Could not connect to backend. Please ensure the Spring Boot server is running on port 8080.'; }
    });
  }

  addEmployee(): void {
    if (!this.newEmployee.firstName || !this.newEmployee.lastName || !this.newEmployee.email) {
      return;
    }
    this.employeeService.addEmployee(this.newEmployee).subscribe({
      next: (emp) => {
        this.employees.push(emp);
        this.newEmployee = { firstName: '', lastName: '', email: '' };
      },
      error: () => { this.errorMessage = 'Failed to add employee.'; }
    });
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
    this.isEditing = true;
  }

  updateEmployee(): void {
    if (!this.selectedEmployee || !this.selectedEmployee.id) { return; }
    this.employeeService.updateEmployee(this.selectedEmployee.id, this.selectedEmployee).subscribe({
      next: (updated) => {
        const index = this.employees.findIndex(e => e.id === updated.id);
        if (index !== -1) { this.employees[index] = updated; }
        this.cancelEdit();
      },
      error: () => { this.errorMessage = 'Failed to update employee.'; }
    });
  }

  cancelEdit(): void {
    this.selectedEmployee = null;
    this.isEditing = false;
  }

  deleteEmployee(id: number | undefined): void {
    if (!id) { return; }
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => { this.employees = this.employees.filter(e => e.id !== id); },
      error: () => { this.errorMessage = 'Failed to delete employee.'; }
    });
  }
}

