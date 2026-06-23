<script setup>
defineProps({
  employees: {
    type: Array,
    required: true,
    default: () => [],
  },
  formatSalary: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div class="card">
    <div
      class="card-header d-flex flex-wrap align-items-center justify-content-between"
    >
      <span> <i class="bi bi-people me-2"></i>All Employees </span>
      <span class="badge bg-light text-secondary">
        {{ employees.length }} active records
      </span>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive table-responsive-custom">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Annual Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(emp, index) in employees" :key="emp.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <span class="avatar-placeholder me-2">
                    {{ emp.firstName[0] }}{{ emp.lastName[0] }}
                  </span>
                  {{ emp.firstName }} {{ emp.lastName }}
                </div>
              </td>
              <td>{{ emp.department }}</td>
              <td>{{ emp.role }}</td>
              <td>{{ formatSalary(emp.salary) }}</td>
              <td>
                <span
                  class="badge rounded-pill"
                  :class="emp.active ? 'bg-success' : 'bg-secondary'"
                >
                  {{ emp.active ? "Active" : "Inactive" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
