// Manages employee data only - clean separation of concerns
// Contains dummy data and basic CRUD operations

import { ref } from "vue";

// Helper to generate unique IDs
let idCounter = 100;

// 15 dummy employee records
const dummyEmployees = [
  {
    id: idCounter++,
    firstName: "Thabo",
    lastName: "Mokoena",
    department: "Engineering",
    role: "Senior Developer",
    salary: 780000,
    active: true,
    email: "thabo.m@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Lindiwe",
    lastName: "Ndlovu",
    department: "Engineering",
    role: "Team Lead",
    salary: 920000,
    active: true,
    email: "lindiwe.n@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Sipho",
    lastName: "Zulu",
    department: "QA",
    role: "QA Engineer",
    salary: 620000,
    active: true,
    email: "sipho.z@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Zanele",
    lastName: "Petersen",
    department: "Engineering",
    role: "Full Stack Developer",
    salary: 720000,
    active: true,
    email: "zanele.p@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Pieter",
    lastName: "van der Merwe",
    department: "Product",
    role: "Product Manager",
    salary: 880000,
    active: true,
    email: "pieter.v@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Nomsa",
    lastName: "Mthembu",
    department: "Engineering",
    role: "DevOps Engineer",
    salary: 760000,
    active: false,
    email: "nomsa.m@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Johan",
    lastName: "Botha",
    department: "Customer Support",
    role: "Support Lead",
    salary: 580000,
    active: true,
    email: "johan.b@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Precious",
    lastName: "Ngwenya",
    department: "Sales",
    role: "Account Executive",
    salary: 680000,
    active: true,
    email: "precious.n@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Sarah",
    lastName: "Jacobs",
    department: "Marketing",
    role: "Marketing Manager",
    salary: 640000,
    active: true,
    email: "sarah.j@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Andile",
    lastName: "Khumalo",
    department: "Engineering",
    role: "Frontend Developer",
    salary: 660000,
    active: true,
    email: "andile.k@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Annelize",
    lastName: "Smit",
    department: "HR",
    role: "HR Generalist",
    salary: 520000,
    active: true,
    email: "annelize.s@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Tshepo",
    lastName: "Masemola",
    department: "Engineering",
    role: "Backend Developer",
    salary: 700000,
    active: true,
    email: "tshepo.m@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Nadine",
    lastName: "Rossouw",
    department: "Finance",
    role: "Financial Analyst",
    salary: 560000,
    active: true,
    email: "nadine.r@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Bongani",
    lastName: "Mabaso",
    department: "Customer Support",
    role: "Support Engineer",
    salary: 540000,
    active: true,
    email: "bongani.m@moderntech.co.za",
  },
  {
    id: idCounter++,
    firstName: "Karin",
    lastName: "Swanepoel",
    department: "Engineering",
    role: "Mobile Developer",
    salary: 680000,
    active: true,
    email: "karin.s@moderntech.co.za",
  },
];

export function useEmployees() {
  const employees = ref([...dummyEmployees]);

  const getEmployeeById = (id) => {
    return employees.value.find((emp) => emp.id === id);
  };

  const getEmployeeByName = (fullName) => {
    return employees.value.find(
      (emp) => `${emp.firstName} ${emp.lastName}` === fullName,
    );
  };

  const getActiveEmployees = () => {
    return employees.value.filter((emp) => emp.active);
  };

  const getEmployeesByDepartment = (department) => {
    return employees.value.filter((emp) => emp.department === department);
  };

  const saveEmployees = () => {
    try {
      localStorage.setItem("hr_employees", JSON.stringify(employees.value));
    } catch (e) {
      console.warn("LocalStorage not available");
    }
  };

  const loadEmployees = () => {
    try {
      const saved = localStorage.getItem("hr_employees");
      if (saved) {
        employees.value = JSON.parse(saved);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return {
    employees,
    getEmployeeById,
    getEmployeeByName,
    getActiveEmployees,
    getEmployeesByDepartment,
    saveEmployees,
    loadEmployees,
  };
}
