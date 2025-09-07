import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProgramData {
  title: string
  description: string
  startDate: string
  location: string
}

export const useProgramStore = defineStore('program', () => {
  // State
  const programs = ref<ProgramData[]>([
    {
      title: 'Emergency Food Relief Program',
      description:
        'Weekly food distribution and meal services for individuals and families experiencing food insecurity',
      startDate: 'Ongoing',
      location: 'Sydney CBD',
    },
    {
      title: 'Housing Support Services',
      description:
        'Assistance with finding affordable housing, tenancy support, and homelessness prevention programs',
      startDate: 'Ongoing',
      location: 'Western Sydney',
    },
    {
      title: 'Mental Health Counseling',
      description:
        'Free counseling services for individuals and families dealing with mental health challenges',
      startDate: 'Ongoing',
      location: 'Inner West Sydney',
    },
    {
      title: 'Youth Employment Program',
      description:
        'Job readiness training, resume building, and employment placement for disadvantaged young people',
      startDate: 'February 2024',
      location: 'South West Sydney',
    },
    {
      title: 'Family Support Services',
      description: 'Parenting programs, family counseling, and support for families in crisis',
      startDate: 'Ongoing',
      location: 'Northern Beaches',
    },
    {
      title: 'Aged Care Support',
      description:
        'In-home care services, social activities, and support for elderly community members',
      startDate: 'Ongoing',
      location: 'Eastern Suburbs',
    },
    {
      title: 'Disability Services',
      description:
        'Support coordination, daily living assistance, and community participation programs',
      startDate: 'Ongoing',
      location: 'Sydney Metro',
    },
    {
      title: 'Multicultural Settlement Program',
      description:
        'Language classes, cultural orientation, and settlement support for new migrants and refugees',
      startDate: 'March 2024',
      location: 'South West Sydney',
    },
    {
      title: 'Financial Literacy Workshop',
      description:
        'Budgeting, debt management, and financial planning education for low-income individuals',
      startDate: 'April 2024',
      location: 'Western Sydney',
    },
    {
      title: 'Domestic Violence Support',
      description:
        'Crisis intervention, safety planning, and support services for victims of domestic violence',
      startDate: 'Ongoing',
      location: 'Sydney CBD',
    },
    {
      title: 'Community Garden Program',
      description: 'Urban gardening initiative promoting food security and community connection',
      startDate: 'May 2024',
      location: 'Inner West Sydney',
    },
    {
      title: 'Digital Literacy Training',
      description:
        'Basic computer skills, internet safety, and digital inclusion programs for seniors and disadvantaged individuals',
      startDate: 'June 2024',
      location: 'Northern Beaches',
    },
    {
      title: 'Homeless Outreach Services',
      description: 'Street outreach, emergency accommodation, and pathway to housing programs',
      startDate: 'Ongoing',
      location: 'Sydney CBD',
    },
    {
      title: 'Childcare Support Program',
      description:
        'Affordable childcare services and early childhood development programs for low-income families',
      startDate: 'Ongoing',
      location: 'Eastern Suburbs',
    },
    {
      title: 'Addiction Recovery Support',
      description:
        'Counseling, peer support groups, and rehabilitation programs for individuals with substance abuse issues',
      startDate: 'Ongoing',
      location: 'Western Sydney',
    },
    {
      title: 'Community Transport Service',
      description:
        'Affordable transport options for elderly and disabled community members to access essential services',
      startDate: 'Ongoing',
      location: 'Sydney Metro',
    },
    {
      title: 'Legal Aid Clinic',
      description:
        'Free legal advice and representation for disadvantaged individuals facing legal issues',
      startDate: 'July 2024',
      location: 'Sydney CBD',
    },
    {
      title: 'Skills Development Workshop',
      description:
        'Vocational training, certification programs, and job placement assistance for unemployed individuals',
      startDate: 'August 2024',
      location: 'South West Sydney',
    },
    {
      title: 'Community Health Program',
      description:
        'Health screenings, preventive care, and health education for underserved populations',
      startDate: 'Ongoing',
      location: 'Western Sydney',
    },
    {
      title: 'Social Inclusion Activities',
      description:
        'Community events, social groups, and recreational activities to combat social isolation',
      startDate: 'Ongoing',
      location: 'Sydney Metro',
    },
  ])

  // Getters
  const getPrograms = () => programs.value
  const getProgramByTitle = (title: string) =>
    programs.value.find((program) => program.title === title)

  // Actions
  const addProgram = (program: ProgramData) => {
    programs.value.push(program)
  }

  const removeProgram = (title: string) => {
    const index = programs.value.findIndex((program) => program.title === title)
    if (index > -1) {
      programs.value.splice(index, 1)
    }
  }

  const updateProgram = (title: string, updatedProgram: Partial<ProgramData>) => {
    const index = programs.value.findIndex((program) => program.title === title)
    if (index > -1) {
      programs.value[index] = { ...programs.value[index], ...updatedProgram }
    }
  }

  return {
    // State
    programs,
    // Getters
    getPrograms,
    getProgramByTitle,
    // Actions
    addProgram,
    removeProgram,
    updateProgram,
  }
})
