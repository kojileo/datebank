export interface Place {
    id: string;
    name: string;
    description?: string;
    address?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreatePlaceInput {
    name: string;
    description?: string;
    address?: string;
  }