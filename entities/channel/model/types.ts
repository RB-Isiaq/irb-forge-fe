export interface Channel {
  id: string;
  organizationId: string;
  name: string;
  isDefault: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  authorId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface CreateChannelPayload {
  name: string;
}

export interface SendChannelMessagePayload {
  content: string;
}
