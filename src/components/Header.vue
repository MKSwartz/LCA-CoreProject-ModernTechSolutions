<script setup></script>

<template>
  <header>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2"
    >
      <div class="container">
        <a class="navbar-brand" href="#"> ModernTech HR </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" href="#">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="bi bi-person-badge me-1"></i> Employees
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="bi bi-calendar-event me-1"></i> Time Off
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="bi bi-wallet me-1"></i> Payroll
              </a>
            </li>
          </ul>
          <!-- User badge -->
          <span
            class="badge bg-primary bg-opacity-10 text-primary ms-2 d-none d-lg-inline-block"
          >
            <i class="bi bi-person-circle me-1"></i> HR Admin
          </span>
        </div>
      </div>
    </nav>
  </header>
</template>
