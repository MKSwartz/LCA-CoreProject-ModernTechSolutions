<!-- Manages time off requests with approve/reject actions -->
<script setup>
// TimeOffRequests component with approve/reject actions

import { ref, computed } from "vue";

const props = defineProps({
  requests: {
    type: Array,
    required: true,
    default: () => [],
  },
  employees: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["approve", "reject", "add"]);

// Computed: count of pending requests
const pendingCount = computed(() => {
  return props.requests.filter((r) => r.status === "pending").length;
});

// New request form state
const newRequest = ref({
  employeeName: "",
  type: "Vacation",
  start: "",
  end: "",
});

// Format date for display (YYYY-MM-DD to readable)
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
};

// Handle approve action - emit to parent
const handleApprove = (id) => {
  emit("approve", id);
};

// Handle reject action - emit to parent
const handleReject = (id) => {
  emit("reject", id);
};

// Handle add request - emit to parent
const handleAddRequest = () => {
  if (
    !newRequest.value.employeeName ||
    !newRequest.value.start ||
    !newRequest.value.end
  ) {
    alert("Please fill in all fields");
    return;
  }
  emit("add", { ...newRequest.value });
  // Reset form
  newRequest.value = { employeeName: "", type: "Vacation", start: "", end: "" };
};
</script>

<template>
  <div class="card">
    <div
      class="card-header d-flex flex-wrap align-items-center justify-content-between"
    >
      <span>
        <i class="bi bi-calendar-week me-2"></i>
        Time Off Requests
      </span>
      <span v-if="pendingCount" class="badge bg-warning ms-2">
        {{ pendingCount }} pending
      </span>
    </div>
    <div class="card-body">
      <!-- Add new request form -->
      <div class="row g-2 mb-3 p-2 bg-light rounded-3">
        <div class="col-md-3">
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="newRequest.employeeName"
            placeholder="Employee name"
            list="employeeList"
          />
          <datalist id="employeeList">
            <option
              v-for="emp in employees"
              :key="emp.id"
              :value="emp.firstName + ' ' + emp.lastName"
            ></option>
          </datalist>
        </div>
        <div class="col-md-2">
          <select class="form-select form-select-sm" v-model="newRequest.type">
            <option value="Vacation">Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="col-md-2">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="newRequest.start"
          />
        </div>
        <div class="col-md-2">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="newRequest.end"
          />
        </div>
        <div class="col-md-3">
          <button
            class="btn btn-primary btn-sm w-100"
            @click="handleAddRequest"
          >
            <i class="bi bi-plus-circle me-1"></i> Add Request
          </button>
        </div>
      </div>

      <!-- Requests table -->
      <div class="table-responsive">
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in requests" :key="req.id">
              <td>{{ req.employeeName }}</td>
              <td>
                <span class="badge bg-info bg-opacity-10 text-info">
                  {{ req.type }}
                </span>
              </td>
              <td>{{ formatDate(req.start) }}</td>
              <td>{{ formatDate(req.end) }}</td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-warning text-dark': req.status === 'pending',
                    'bg-success': req.status === 'approved',
                    'bg-danger': req.status === 'rejected',
                  }"
                >
                  {{ req.status }}
                </span>
              </td>
              <td>
                <template v-if="req.status === 'pending'">
                  <button
                    class="btn btn-sm btn-outline-success me-1"
                    @click="handleApprove(req.id)"
                    title="Approve"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="handleReject(req.id)"
                    title="Reject"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </template>
                <span v-else class="text-muted small">—</span>
              </td>
            </tr>
            <tr v-if="requests.length === 0">
              <td colspan="6" class="text-center text-muted py-3">
                <i class="bi bi-inbox me-1"></i> No time off requests
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
