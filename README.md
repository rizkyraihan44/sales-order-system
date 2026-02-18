# Sales Order System

A simple Sales Order Management System built using:

- Alpine.js
- Tailwind CSS
- LocalStorage

## Features

### Authentication

- Login system
- Role-based access (Admin & Staff)
- Logout functionality
- Route protection

### Order Management

- Create new sales order
- Edit order (Draft only for staff)
- Delete order (Draft only for staff)
- Change status (Admin only)
- Automatic discount calculation
- Print invoice

### Data Handling

- LocalStorage persistence
- Load sample data if empty

## Roles

### Admin

- Full access
- Can change order status

### Staff

- Cannot change approved order
- Can only edit/delete Draft orders

## Git Workflow

- Feature branches
- Pull requests
- Code review
- Clean merge history

---

Developed for Software Engineering coursework.
