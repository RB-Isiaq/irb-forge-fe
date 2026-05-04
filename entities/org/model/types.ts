export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationPayload {
  name: string;
  description?: string;
  slug?: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  description?: string;
  slug?: string;
}
