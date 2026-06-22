<script setup>
import { onMounted } from "vue";
import { useEmployees } from "./composables/useEmployees";
import { useHRLogic } from "./composables/useHRLogic";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import EmployeeList from "./components/EmployeeList.vue";
import TimeOffRequests from "./components/TimeOffRequests.vue";
import PayrollSection from "./components/PayrollSection.vue";

const { employees, loadEmployees } = useEmployees();

const {
  timeOffRequests,
  attendanceToday,
  pendingRequests,
  totalPayroll,
  averageSalary,
  formatSalary,
  approveRequest,
  rejectRequest,
  addTimeOffRequest,
  generatePayslip,
  saveHRData,
  loadHRData,
} = useHRLogic();

const handleApprove = (id) => {
  approveRequest(id);
};

const handleReject = (id) => {
  rejectRequest(id);
};

const handleAddRequest = (requestData) => {
  const { employeeName, type, start, end } = requestData;
  addTimeOffRequest(employeeName, type, start, end);
};

onMounted(() => {
  const employeesLoaded = loadEmployees();
  const hrLoaded = loadHRData();

  if (!employeesLoaded || !hrLoaded) {
    saveHRData();
  }
});
</script>

<template>
  <div id="app">
    <Header />

    <main class="container py-4">
      <!-- Dashboard stats row with ZAR currency -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card d-flex align-items-center">
            <div class="stat-icon me-3"><i class="bi bi-people"></i></div>
            <div>
              <span class="stat-number">{{ employees.length }}</span>
              <br /><small class="text-secondary">Total employees</small>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card d-flex align-items-center">
            <div class="stat-icon me-3">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div>
              <span class="stat-number">{{ pendingRequests }}</span>
              <br /><small class="text-secondary">Pending requests</small>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card d-flex align-items-center">
            <div class="stat-icon me-3"><i class="bi bi-wallet2"></i></div>
            <div>
              <span class="stat-number">{{ totalPayroll }}</span>
              <br /><small class="text-secondary">Monthly payroll</small>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card d-flex align-items-center">
            <div class="stat-icon me-3">
              <i class="bi bi-clock-history"></i>
            </div>
            <div>
              <span class="stat-number">{{ attendanceToday }}</span>
              <br /><small class="text-secondary">Checked in today</small>
            </div>
          </div>
        </div>
      </div>
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3" id="hrTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="employees-tab"
            data-bs-toggle="tab"
            data-bs-target="#employees"
            type="button"
            role="tab"
          >
            <i class="bi bi-person-lines-fill me-1"></i> Employees
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="timeoff-tab"
            data-bs-toggle="tab"
            data-bs-target="#timeoff"
            type="button"
            role="tab"
          >
            <i class="bi bi-calendar-week me-1"></i> Time Off
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="payroll-tab"
            data-bs-toggle="tab"
            data-bs-target="#payroll"
            type="button"
            role="tab"
          >
            <i class="bi bi-coin me-1"></i> Payroll
          </button>
        </li>
      </ul>

      <!-- Tab content panes -->
      <div class="tab-content" id="hrTabsContent">
        <div class="tab-pane fade show active" id="employees" role="tabpanel">
          <EmployeeList :employees="employees" :formatSalary="formatSalary" />
        </div>

        <div class="tab-pane fade" id="timeoff" role="tabpanel">
          <TimeOffRequests
            :requests="timeOffRequests"
            :employees="employees"
            @approve="handleApprove"
            @reject="handleReject"
            @add="handleAddRequest"
          />
        </div>

        <div class="tab-pane fade" id="payroll" role="tabpanel">
          <PayrollSection
            :employees="employees"
            :totalPayroll="totalPayroll"
            :averageSalary="averageSalary"
            :formatSalary="formatSalary"
            :generatePayslip="generatePayslip"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.stat-number {
  font-size: 1.1rem;
}
</style>
