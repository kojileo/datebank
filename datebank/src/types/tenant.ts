import { User } from '@prisma/client'

export interface Tenant {
    id: string
    name: string
    users: User[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CreateTenantInput {
    name: string
  }