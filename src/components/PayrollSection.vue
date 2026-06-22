<!-- Payroll summary and payslip generator -->
<script setup>
import { ref } from "vue";

const props = defineProps({
  employees: {
    type: Array,
    required: true,
    default: () => [],
  },
  totalPayroll: {
    type: String,
    required: true,
    default: "R0",
  },
  averageSalary: {
    type: Number,
    required: true,
    default: 0,
  },
  formatSalary: {
    type: Function,
    required: true,
  },
  generatePayslip: {
    type: Function,
    required: true,
  },
});

const selectedEmployeeId = ref(null);
const payslipData = ref(null);

const generatePayslipForSelected = () => {
  if (!selectedEmployeeId.value) return;
  const result = props.generatePayslip(selectedEmployeeId.value);
  if (result) {
    payslipData.value = result;
  }
};
</script>

<template>
  <div class="card">
    <div class="card-header">Payroll Overview</div>
    <div class="card-body">
      <!-- Payroll summary stats -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div
            class="payslip-preview d-flex justify-content-between align-items-center"
          >
            <span><i class="bi bi-people me-1"></i> Total employees</span>
            <strong>{{ employees.length }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div
            class="payslip-preview d-flex justify-content-between align-items-center"
          >
            <span><i class="bi bi-wallet2 me-1"></i> Monthly payroll</span>
            <strong>{{ totalPayroll }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div
            class="payslip-preview d-flex justify-content-between align-items-center"
          >
            <span><i class="bi bi-graph-up me-1"></i> Avg annual salary</span>
            <strong>{{ formatSalary(averageSalary) }}</strong>
          </div>
        </div>
      </div>

      <!-- Employee payslip generator -->
      <h6 class="fw-semibold mb-3">
        <i class="bi bi-file-text me-1"></i> Generate Payslip
      </h6>
      <div class="row g-2">
        <div class="col-md-8">
          <select class="form-select" v-model="selectedEmployeeId">
            <option value="">— Select an employee —</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.firstName }} {{ emp.lastName }} — {{ emp.role }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <button
            class="btn btn-primary w-100"
            @click="generatePayslipForSelected"
            :disabled="!selectedEmployeeId"
          >
            <i class="bi bi-receipt me-1"></i> Generate
          </button>
        </div>
      </div>

      <!-- Payslip display -->
      <div v-if="payslipData" class="mt-4 p-3 bg-light rounded-3 border">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1">{{ payslipData.employee }}</h6>
            <small class="text-secondary"
              >{{ payslipData.role }} · {{ payslipData.department }}</small
            >
            <br /><small class="text-secondary"
              >{{ payslipData.period }} · Generated:
              {{ payslipData.generatedAt }}</small
            >
          </div>
          <span class="badge bg-primary">Payslip</span>
        </div>
        <hr class="my-2" />

        <div class="row g-2 text-sm">
          <div class="col-6">
            <span class="text-secondary">Gross Salary:</span>
            {{ payslipData.grossFormatted }}
          </div>
          <div class="col-6">
            <span class="text-secondary">Income Tax (SARS):</span>
            {{ payslipData.taxFormatted }}
          </div>
          <div class="col-6">
            <span class="text-secondary">UIF (1%):</span>
            {{ payslipData.uifFormatted }}
          </div>
          <div class="col-6">
            <span class="text-secondary">SDL (1%):</span>
            {{ payslipData.sdlFormatted }}
          </div>
          <div class="col-6">
            <span class="text-secondary">Medical Aid:</span>
            {{ payslipData.medicalAidFormatted }}
          </div>
          <div class="col-6">
            <span class="text-secondary">Pension Fund:</span>
            {{ payslipData.pensionFormatted }}
          </div>
          <div class="col-12 mt-1">
            <hr />
            <div class="d-flex justify-content-between">
              <span><strong>Total Deductions:</strong></span>
              <span class="text-danger">{{
                payslipData.totalDeductionsFormatted
              }}</span>
            </div>
            <div class="d-flex justify-content-between fs-5">
              <span><strong>Net Pay:</strong></span>
              <span class="text-success fw-bold">{{
                payslipData.netFormatted
              }}</span>
            </div>
          </div>
        </div>
        <button
          class="btn btn-sm btn-outline-secondary mt-2"
          @click="payslipData = null"
        >
          <i class="bi bi-x-circle me-1"></i> Clear
        </button>
      </div>
    </div>
  </div>
</template>
