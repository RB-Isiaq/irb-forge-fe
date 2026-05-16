export interface Message {
  id: string;
  organizationId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface SendMessagePayload {
  content: string;
}
