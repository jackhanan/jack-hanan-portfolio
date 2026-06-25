export interface Project {
  id: string
  title: string
  year: number
  category: string
  description: string
  heroImage: string
  gallery: string[]
  drawings: string[]
  featured: boolean
  order: number
  visible: boolean
}

export interface EducationEntry {
  institution: string
  degree: string
  year: string
}

export interface AboutData {
  heroEyebrow: string
  heroName: string
  heroTagline: string
  bio: string
  photo: string
  skills: string[]
  software: string[]
  education: EducationEntry[]
  email: string
  linkedin: string
  resumeUrl: string
}
