export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked?: boolean;
  isReposted?: boolean;
  createdAt: string;
  author?: import("./user").User;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: import("./user").User;
}





export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
  requester?: import("./user").User;
  addressee?: import("./user").User;
}

export type ConnectionStatus = "Pending" | "Accepted" | "Rejected";

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  unreadCount: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  // enriched client-side
  otherUser?: import("./user").User;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  sentAt: string;
  createdAt?: string;
  sender?: import("./user").User;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  relatedId?: number;
  isRead: boolean;
  createdAt: string;
}
