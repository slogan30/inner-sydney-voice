<script setup lang="ts">
import ProgramCard from '@/components/ProgramCard.vue'

interface ProgramData {
  title: string
  description: string
  joinedDate: string
}

// Test data for 20 program cards
const programs: ProgramData[] = [
  {
    title: 'React Fundamentals',
    description: 'Learn the core concepts of React including components, state, and props',
    joinedDate: 'January 2024',
  },
  {
    title: 'Vue.js Mastery',
    description: 'Master Vue.js framework with composition API and advanced patterns',
    joinedDate: 'February 2024',
  },
  {
    title: 'TypeScript Deep Dive',
    description: 'Advanced TypeScript concepts for building robust applications',
    joinedDate: 'March 2024',
  },
  {
    title: 'Node.js Backend',
    description: 'Build scalable server-side applications with Node.js and Express',
    joinedDate: 'April 2024',
  },
  {
    title: 'Database Design',
    description: 'Learn SQL, NoSQL, and database optimization techniques',
    joinedDate: 'May 2024',
  },
  {
    title: 'UI/UX Design',
    description: 'Create beautiful and intuitive user interfaces and experiences',
    joinedDate: 'June 2024',
  },
  {
    title: 'DevOps Essentials',
    description: 'CI/CD, Docker, Kubernetes, and cloud deployment strategies',
    joinedDate: 'July 2024',
  },
  {
    title: 'Mobile Development',
    description: 'Build cross-platform mobile apps with React Native',
    joinedDate: 'August 2024',
  },
  {
    title: 'Web Security',
    description: 'Protect applications from common vulnerabilities and attacks',
    joinedDate: 'September 2024',
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize web applications for speed and efficiency',
    joinedDate: 'October 2024',
  },
  {
    title: 'GraphQL API',
    description: 'Design and implement GraphQL APIs for modern applications',
    joinedDate: 'November 2024',
  },
  {
    title: 'Testing Strategies',
    description: 'Unit testing, integration testing, and test-driven development',
    joinedDate: 'December 2024',
  },
  {
    title: 'Microservices Architecture',
    description: 'Design and implement scalable microservices systems',
    joinedDate: 'January 2025',
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to ML concepts and practical implementations',
    joinedDate: 'February 2025',
  },
  {
    title: 'Blockchain Development',
    description: 'Build decentralized applications with smart contracts',
    joinedDate: 'March 2025',
  },
  {
    title: 'Cloud Computing',
    description: 'AWS, Azure, and GCP services for scalable applications',
    joinedDate: 'April 2025',
  },
  {
    title: 'Data Visualization',
    description: 'Create interactive charts and dashboards with D3.js',
    joinedDate: 'May 2025',
  },
  {
    title: 'API Design',
    description: 'RESTful API design principles and best practices',
    joinedDate: 'June 2025',
  },
  {
    title: 'Code Quality',
    description: 'Clean code principles, refactoring, and code reviews',
    joinedDate: 'July 2025',
  },
  {
    title: 'Agile Development',
    description: 'Scrum, Kanban, and agile project management methodologies',
    joinedDate: 'August 2025',
  },
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Programs</h1>
      <p class="text-lg text-gray-600">
        Explore our comprehensive collection of development programs
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProgramCard
        v-for="program in programs"
        :key="program.title"
        :title="program.title"
        :description="program.description"
        :joined-date="program.joinedDate"
      />
    </div>
  </div>
</template>
