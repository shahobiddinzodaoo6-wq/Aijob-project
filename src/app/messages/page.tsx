"use client";


import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialService } from "@/services/social.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/AuthStore";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/guards/AuthGuard";
import {
  Send, MessageSquare, Trash2, Search, Plus, X, CheckCheck, ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { clsx } from "clsx";
import type { Conversation, Message } from "@/types/social";
import type { User } from "@/types/user";

/* ── helpers ─────────────────────────────────────── */
function getDisplayName(u?: User | null): string {
  if (!u) return "Unknown";
  if (u.fullName) return u.fullName;
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email;
}

function getInitials(u?: User | null): string {
  const n = getDisplayName(u);
  const parts = n.split(" ").filter(Boolean);
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : n.slice(0, 2).toUpperCase();
}




function formatTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}


function formatMsgTime(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ── Avatar ──────────────────────────────────────── */
function Avatar({ user, size = "md" }: { user?: User | null; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  const photo = (user as any)?.profile?.photoUrl;
  return (
    <div className={clsx(sz, "rounded-full flex-shrink-0 flex items-center justify-center font-bold overflow-hidden",
      photo ? "" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white")}>
      {photo
        ? <img 
            src={photo.startsWith('http') 
              ? photo 
              : (process.env.NEXT_PUBLIC_API_URL === '/' 
                  ? (photo.startsWith('/') ? photo : `/${photo}`)
                  : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')}/${photo.replace(/^\//, '')}`)} 
            alt="" 
            className="w-full h-full object-cover" 
          />
        : getInitials(user)
      }
    </div>
  );
}

/* ── UserMap hook (fetch all users once) ─────────── */
function useUserMap() {
  const { isAuthenticated } = useAuthStore();
  const { data } = useQuery({
    queryKey: ["user-directory"],
    queryFn: userService.getUserDirectory,
    staleTime: 60_000,
    enabled: isAuthenticated,
    retry: false,
  });
  const map = new Map<number, User>();
  data?.forEach((u) => map.set(Number(u.id), u));
  return map;
}

/* ── NewConversationModal ────────────────────────── */
function NewConversationModal({
  onClose, onCreated,
}: { onClose: () => void; onCreated: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const { user: me } = useAuthStore();
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["user-directory"],
    queryFn: userService.getUserDirectory,
  });

  const filtered = users.filter(
    (u) =>
      String(u.id) !== String(me?.id) &&
      (getDisplayName(u).toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()))
  );

  const createMutation = useMutation({
    mutationFn: (otherUserId: number) => socialService.createConversation(otherUserId),
    onSuccess: (conv) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      onCreated(conv.id);
      onClose();
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">New Message</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people by name or email..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition placeholder:text-slate-400"
            />
          </div>

          <div className="max-h-72 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">
                {query ? "No users found" : "No users available"}
              </p>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  disabled={createMutation.isPending}
                  onClick={() => createMutation.mutate(Number(u.id))}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-left transition-colors disabled:opacity-50"
                >
                  <Avatar user={u} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{getDisplayName(u)}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  {createMutation.isPending && (
                    <div className="ml-auto animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ConversationItem ────────────────────────────── */
function ConversationItem({
  conv, myId, userMap, isSelected, onClick, onDelete,
}: {
  conv: Conversation; myId: number; userMap: Map<number, User>;
  isSelected: boolean; onClick: () => void; onDelete: () => void;
}) {
  const otherId = conv.user1Id === myId ? conv.user2Id : conv.user1Id;
  const other = userMap.get(otherId) ?? conv.otherUser;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors group relative select-none",
        isSelected ? "bg-blue-50 border-r-2 border-blue-600" : "hover:bg-slate-50"
      )}
    >
      <Avatar user={other} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1">
          <p className={clsx("text-sm font-semibold truncate", isSelected ? "text-blue-700" : "text-slate-900")}>
            {getDisplayName(other)}
          </p>
          {conv.lastMessageAt && (
            <span className="text-[10px] text-slate-400 flex-shrink-0">{formatTime(conv.lastMessageAt)}</span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {conv.lastMessagePreview ?? "No messages yet"}
        </p>
      </div>
      {(conv.unreadCount ?? 0) > 0 && (
        <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {conv.unreadCount}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

/* ── MessageBubble ───────────────────────────────── */
function MessageBubble({ msg, isMe, showAvatar, sender }: {
  msg: Message; isMe: boolean; showAvatar: boolean; sender?: User | null;
}) {
  const time = msg.sentAt || msg.createdAt;
  return (
    <div className={clsx("flex items-end gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
      <div className="w-7 flex-shrink-0">
        {showAvatar && !isMe && <Avatar user={sender} size="sm" />}
      </div>
      <div className={clsx("max-w-[70%] flex flex-col", isMe ? "items-end" : "items-start")}>
        <div className={clsx(
          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isMe
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
        )}>
          {msg.content}
        </div>
        <div className={clsx("flex items-center gap-1 mt-1 px-1", isMe ? "flex-row-reverse" : "flex-row")}>
          <span className="text-[10px] text-slate-400">{formatMsgTime(time)}</span>
          {isMe && <CheckCheck size={12} className="text-blue-400" />}
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────── */
function MessagesContent() {
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();
  const myId = Number(user?.id);

  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userMap = useUserMap();

  /* conversations — only poll when properly authenticated */
  const { data: conversations = [], isLoading: convsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: socialService.getConversations,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 10_000 : false,
    retry: false,
  });

  /* messages in selected conversation */
  const { data: messages = [], isLoading: msgsLoading } = useQuery({
    queryKey: ["messages", selectedConvId],
    queryFn: () => socialService.getMessages(selectedConvId!),
    enabled: isAuthenticated && selectedConvId != null,
    refetchInterval: isAuthenticated && selectedConvId != null ? 4_000 : false,
    retry: false,
  });

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on conv select
  useEffect(() => {
    if (selectedConvId) inputRef.current?.focus();
  }, [selectedConvId]);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) ?? null;

  const otherUserId = selectedConv
    ? selectedConv.user1Id === myId ? selectedConv.user2Id : selectedConv.user1Id
    : null;
  const otherUser = otherUserId != null ? userMap.get(otherUserId) ?? null : null;

  /* search filter */
  const filteredConvs = conversations.filter((c) => {
    if (!search.trim()) return true;
    const othId = c.user1Id === myId ? c.user2Id : c.user1Id;
    const oth = userMap.get(othId);
    return (
      getDisplayName(oth).toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessagePreview ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  /* send */
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      socialService.sendMessage({ conversationId: selectedConvId!, content }),
    onSuccess: () => {
      setNewMsg("");
      qc.invalidateQueries({ queryKey: ["messages", selectedConvId] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  /* delete conv */
  const deleteConvMutation = useMutation({
    mutationFn: (id: number) => socialService.deleteConversation(id),
    onSuccess: () => {
      toast.success("Conversation deleted");
      setSelectedConvId(null);
      setMobileView("list");
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const handleSend = useCallback(() => {
    const txt = newMsg.trim();
    if (!txt || selectedConvId == null) return;
    sendMutation.mutate(txt);
  }, [newMsg, selectedConvId, sendMutation]);

  const handleSelect = (id: number) => {
    setSelectedConvId(id);
    setMobileView("chat");
  };

  // Group messages by date for dividers
  type Group = { date: string; msgs: Message[] };
  const grouped = messages.reduce<Group[]>((acc, msg) => {
    const time = msg.sentAt || msg.createdAt || "";
    const date = time
      ? new Date(time).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
      : "Today";
    const last = acc[acc.length - 1];
    if (last?.date === date) last.msgs.push(msg);
    else acc.push({ date, msgs: [msg] });
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {showNew && (
        <NewConversationModal
          onClose={() => setShowNew(false)}
          onCreated={(id) => { handleSelect(id); }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden"
          style={{ height: "calc(100vh - 160px)", minHeight: 520 }}
        >
          {/* ── Sidebar ─────────────────────────────── */}
          <aside className={clsx(
            "w-full md:w-80 border-r border-slate-100 flex flex-col flex-shrink-0",
            mobileView === "chat" ? "hidden md:flex" : "flex"
          )}>
            {/* Header */}
            <div className="px-4 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900">Messages</h2>
                <button
                  onClick={() => setShowNew(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                  title="New Message"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {convsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3 px-6 text-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <MessageSquare size={24} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">No conversations yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click <strong>+</strong> to start one</p>
                  </div>
                </div>
              ) : (
                filteredConvs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    myId={myId}
                    userMap={userMap}
                    isSelected={selectedConvId === conv.id}
                    onClick={() => handleSelect(conv.id)}
                    onDelete={() => deleteConvMutation.mutate(conv.id)}
                  />
                ))
              )}
            </div>
          </aside>

          {/* ── Chat panel ─────────────────────────── */}
          <div className={clsx(
            "flex-1 flex flex-col min-w-0",
            mobileView === "list" ? "hidden md:flex" : "flex"
          )}>
            {selectedConvId == null ? (
              /* empty state */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={36} className="text-blue-200" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">Your Messages</h3>
                  <p className="text-sm text-slate-400 mb-5">Select a conversation or start a new one.</p>
                  <button
                    onClick={() => setShowNew(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    <Plus size={15} /> New Message
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-white">
                  <button
                    className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 mr-1 transition-colors"
                    onClick={() => setMobileView("list")}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <Avatar user={otherUser} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{getDisplayName(otherUser)}</p>
                    {otherUser?.email && (
                      <p className="text-xs text-slate-400 truncate">{otherUser.email}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteConvMutation.mutate(selectedConvId)}
                    disabled={deleteConvMutation.isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete conversation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50/60 space-y-1">
                  {msgsLoading ? (
                    <div className="flex justify-center pt-12">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                    </div>
                  ) : grouped.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
                      <p className="text-sm font-medium text-slate-400">No messages yet</p>
                      <p className="text-xs text-slate-400">Say hello 👋</p>
                    </div>
                  ) : (
                    grouped.map(({ date, msgs }) => (
                      <div key={date}>
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-slate-200" />
                          <span className="text-[11px] text-slate-400 font-medium px-2 whitespace-nowrap">{date}</span>
                          <div className="flex-1 h-px bg-slate-200" />
                        </div>
                        <div className="space-y-1.5">
                          {msgs.map((msg, i) => {
                            const isMe = Number(msg.senderId) === myId;
                            const prev = msgs[i - 1];
                            const showAvatar = !prev || prev.senderId !== msg.senderId;
                            const sender = isMe ? undefined : (userMap.get(Number(msg.senderId)) ?? msg.sender);
                            return (
                              <MessageBubble
                                key={msg.id}
                                msg={msg}
                                isMe={isMe}
                                showAvatar={showAvatar}
                                sender={sender}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition">
                    <input
                      ref={inputRef}
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMsg.trim() || sendMutation.isPending}
                      className={clsx(
                        "flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all",
                        newMsg.trim()
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      {sendMutation.isPending
                        ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        : <Send size={15} />
                      }
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 px-1">Enter to send</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return <AuthGuard><MessagesContent /></AuthGuard>;
}
