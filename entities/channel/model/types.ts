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

/** Cursor-paginated — `nextCursor` is the oldest item's `createdAt`, or `null` when exhausted. */
export interface CursorPaginatedMessages {
  items: ChannelMessage[];
  nextCursor: string | null;
}

export interface ChannelMember {
  id: string;
  channelId: string;
  organizationId: string;
  userId: string;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface AddChannelMemberPayload {
  userId: string;
}
