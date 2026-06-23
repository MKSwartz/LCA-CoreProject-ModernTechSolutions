import { ref, computed } from "vue";
import { useEmployees } from "./useEmployees";

const TAX_BRACKETS = [
  { min: 0, max: 237100, rate: 0.18, base: 0 },
  { min: 237101, max: 370500, rate: 0.26, base: 42678 },
  { min: 370501, max: 512800, rate: 0.31, base: 77362 },
  { min: 512801, max: 673000, rate: 0.36, base: 121475 },
  { min: 673001, max: 857900, rate: 0.39, base: 179147 },
  { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
  { min: 1817001, max: Infinity, rate: 0.45, base: 644489 },
];

// Calculate annual tax based on salary
const calculateAnnualTax = (annualSalary) => {
  for (const bracket of TAX_BRACKETS) {
    if (annualSalary <= bracket.max) {
      return bracket.base + (annualSalary - bracket.min) * bracket.rate;
    }
  }
  return annualSalary * 0.45;
};

// Calculate monthly tax
const calculateMonthlyTax = (annualSalary) => {
  return Math.round(calculateAnnualTax(annualSalary) / 12);
};

// Dummy time off requests
const dummyTimeOff = [
  {
    id: 1,
    employeeName: "Sipho Zulu",
    type: "Vacation",
    start: "2026-07-10",
    end: "2026-07-14",
    status: "pending",
  },
  {
    id: 2,
    employeeName: "Zanele Petersen",
    type: "Sick Leave",
    start: "2026-06-28",
    end: "2026-06-29",
    status: "approved",
  },
  {
    id: 3,
    employeeName: "Pieter van der Merwe",
    type: "Vacation",
    start: "2026-08-01",
    end: "2026-08-05",
    status: "pending",
  },
  {
    id: 4,
    employeeName: "Nomsa Mthembu",
    type: "Personal",
    start: "2026-07-05",
    end: "2026-07-06",
    status: "approved",
  },
  {
    id: 5,
    employeeName: "Johan Botha",
    type: "Vacation",
    start: "2026-07-20",
    end: "2026-07-22",
    status: "pending",
  },
  {
    id: 6,
    employeeName: "Precious Ngwenya",
    type: "Sick Leave",
    start: "2026-07-15",
    end: "2026-07-16",
    status: "approved",
  },
  {
    id: 7,
    employeeName: "Andile Khumalo",
    type: "Vacation",
    start: "2026-09-01",
    end: "2026-09-05",
    status: "pending",
  },
];

// Dummy attendance
const dummyAttendance = [
  "Thabo Mokoena",
  "Lindiwe Ndlovu",
  "Sipho Zulu",
  "Zanele Petersen",
  "Pieter van der Merwe",
  "Johan Botha",
  "Precious Ngwenya",
  "Sarah Jacobs",
  "Andile Khumalo",
  "Tshepo Masemola",
];

let timeOffIdCounter = 100;

// Currency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format currency simplified
const formatCurrencySimple = (amount) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("R", "")
    .trim();
};

export function useHRLogic() {
  const { employees, getEmployeeByName, saveEmployees } = useEmployees();

  const timeOffRequests = ref([...dummyTimeOff]);
  const attendanceToday = ref(dummyAttendance.length);
  const attendanceList = ref([...dummyAttendance]);

  const pendingRequests = computed(() => {
    return timeOffRequests.value.filter((req) => req.status === "pending")
      .length;
  });

  const approvedRequests = computed(() => {
    return timeOffRequests.value.filter((req) => req.status === "approved")
      .length;
  });

  const totalPayroll = computed(() => {
    const totalMonthly = employees.value.reduce(
      (sum, emp) => sum + emp.salary / 12,
      0,
    );
    return formatCurrency(totalMonthly);
  });

  // total monthly payroll
  const totalPayrollRaw = computed(() => {
    return employees.value.reduce((sum, emp) => sum + emp.salary / 12, 0);
  });

  // average salary (annual)
  const averageSalary = computed(() => {
    if (employees.value.length === 0) return 0;
    const total = employees.value.reduce((sum, emp) => sum + emp.salary, 0);
    return Math.round(total / employees.value.length);
  });

  const approveRequest = (requestId) => {
    const req = timeOffRequests.value.find((r) => r.id === requestId);
    if (req && req.status === "pending") {
      req.status = "approved";
      saveHRData();
      return true;
    }
    return false;
  };

  const rejectRequest = (requestId) => {
    const req = timeOffRequests.value.find((r) => r.id === requestId);
    if (req && req.status === "pending") {
      req.status = "rejected";
      saveHRData();
      return true;
    }
    return false;
  };

  const addTimeOffRequest = (employeeName, type, start, end) => {
    const emp = getEmployeeByName(employeeName);
    if (!emp) return false;

    const newRequest = {
      id: timeOffIdCounter++,
      employeeName,
      type,
      start,
      end,
      status: "pending",
    };
    timeOffRequests.value.push(newRequest);
    saveHRData();
    return true;
  };

  const getRequestsByStatus = (status) => {
    return timeOffRequests.value.filter((req) => req.status === status);
  };

  const getRequestsForEmployee = (employeeName) => {
    return timeOffRequests.value.filter(
      (req) => req.employeeName === employeeName,
    );
  };

  // Attendance Management
  const checkInEmployee = (employeeName) => {
    if (!attendanceList.value.includes(employeeName)) {
      attendanceList.value.push(employeeName);
      attendanceToday.value = attendanceList.value.length;
      saveHRData();
      return true;
    }
    return false;
  };

  const checkOutEmployee = (employeeName) => {
    const index = attendanceList.value.indexOf(employeeName);
    if (index !== -1) {
      attendanceList.value.splice(index, 1);
      attendanceToday.value = attendanceList.value.length;
      saveHRData();
      return true;
    }
    return false;
  };

  const getAttendanceList = () => {
    return [...attendanceList.value];
  };

  // Payroll Management
  const generatePayslip = (employeeId) => {
    const emp = employees.value.find((e) => e.id === employeeId);
    if (!emp) return null;

    const monthlyGross = Math.round(emp.salary / 12);

    const monthlyTax = calculateMonthlyTax(emp.salary);

    const uif = Math.round(monthlyGross * 0.01);

    const sdl = Math.round(monthlyGross * 0.01);

    const medicalAid = Math.round(monthlyGross * 0.08);

    const pension = Math.round(monthlyGross * 0.05);

    const totalDeductions = monthlyTax + uif + sdl + medicalAid + pension;
    const net = monthlyGross - totalDeductions;

    return {
      employee: `${emp.firstName} ${emp.lastName}`,
      role: emp.role,
      department: emp.department,
      gross: monthlyGross,
      tax: monthlyTax,
      uif: uif,
      sdl: sdl,
      medicalAid: medicalAid,
      pension: pension,
      totalDeductions: totalDeductions,
      net: net,
      period: "June 2026",
      generatedAt: new Date().toLocaleString("en-ZA", {
        timeZone: "Africa/Johannesburg",
      }),
      // Formatted for display
      grossFormatted: formatCurrency(monthlyGross),
      taxFormatted: formatCurrency(monthlyTax),
      uifFormatted: formatCurrency(uif),
      sdlFormatted: formatCurrency(sdl),
      medicalAidFormatted: formatCurrency(medicalAid),
      pensionFormatted: formatCurrency(pension),
      totalDeductionsFormatted: formatCurrency(totalDeductions),
      netFormatted: formatCurrency(net),
    };
  };

  const generateAllPayslips = () => {
    return employees.value.map((emp) => generatePayslip(emp.id));
  };

  const getPayrollByDepartment = () => {
    const deptMap = {};
    employees.value.forEach((emp) => {
      if (!deptMap[emp.department]) {
        deptMap[emp.department] = { count: 0, total: 0, totalFormatted: "" };
      }
      deptMap[emp.department].count++;
      deptMap[emp.department].total += emp.salary;
    });
    Object.keys(deptMap).forEach((key) => {
      deptMap[key].totalFormatted = formatCurrency(deptMap[key].total);
    });
    return deptMap;
  };

  //Data Persistence
  const saveHRData = () => {
    try {
      localStorage.setItem("hr_timeoff", JSON.stringify(timeOffRequests.value));
      localStorage.setItem(
        "hr_attendance",
        JSON.stringify(attendanceList.value),
      );
      saveEmployees();
    } catch (e) {
      console.warn("LocalStorage not available");
    }
  };

  const loadHRData = () => {
    try {
      const savedTimeOff = localStorage.getItem("hr_timeoff");
      const savedAttendance = localStorage.getItem("hr_attendance");

      if (savedTimeOff) {
        timeOffRequests.value = JSON.parse(savedTimeOff);
      }
      if (savedAttendance) {
        attendanceList.value = JSON.parse(savedAttendance);
        attendanceToday.value = attendanceList.value.length;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  // Statistics / Analytics

  const getDepartmentStats = () => {
    const stats = {};
    employees.value.forEach((emp) => {
      if (!stats[emp.department]) {
        stats[emp.department] = {
          total: 0,
          active: 0,
          totalSalary: 0,
          totalSalaryFormatted: "",
        };
      }
      stats[emp.department].total++;
      if (emp.active) stats[emp.department].active++;
      stats[emp.department].totalSalary += emp.salary;
    });
    Object.keys(stats).forEach((key) => {
      stats[key].totalSalaryFormatted = formatCurrency(stats[key].totalSalary);
    });
    return stats;
  };

  const getAttendanceRate = () => {
    const active = employees.value.filter((emp) => emp.active).length;
    if (active === 0) return 0;
    return Math.round((attendanceList.value.length / active) * 100);
  };

  const formatSalary = formatCurrency;

  return {
    timeOffRequests,
    attendanceToday,
    attendanceList,

    pendingRequests,
    approvedRequests,
    totalPayroll,
    totalPayrollRaw,
    averageSalary,

    formatSalary,
    formatCurrencySimple,

    approveRequest,
    rejectRequest,
    addTimeOffRequest,
    getRequestsByStatus,
    getRequestsForEmployee,

    checkInEmployee,
    checkOutEmployee,
    getAttendanceList,

    generatePayslip,
    generateAllPayslips,
    getPayrollByDepartment,

    getDepartmentStats,
    getAttendanceRate,

    saveHRData,
    loadHRData,
  };
}
