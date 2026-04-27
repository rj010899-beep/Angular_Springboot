package com.example.demo.service;

import com.example.demo.model.Employee;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class EmployeeService {

    private final List<Employee> employees = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public EmployeeService() {
        employees.add(new Employee(idCounter.getAndIncrement(), "John", "Doe", "john.doe@example.com"));
        employees.add(new Employee(idCounter.getAndIncrement(), "Jane", "Smith", "jane.smith@example.com"));
        employees.add(new Employee(idCounter.getAndIncrement(), "Bob", "Johnson", "bob.johnson@example.com"));
    }

    public List<Employee> getAllEmployees() {
        return new ArrayList<>(employees);
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employees.stream().filter(e -> e.getId().equals(id)).findFirst();
    }

    public Employee addEmployee(Employee employee) {
        employee.setId(idCounter.getAndIncrement());
        employees.add(employee);
        return employee;
    }

    public Optional<Employee> updateEmployee(Long id, Employee updated) {
        return getEmployeeById(id).map(existing -> {
            existing.setFirstName(updated.getFirstName());
            existing.setLastName(updated.getLastName());
            existing.setEmail(updated.getEmail());
            return existing;
        });
    }

    public boolean deleteEmployee(Long id) {
        return employees.removeIf(e -> e.getId().equals(id));
    }
}
