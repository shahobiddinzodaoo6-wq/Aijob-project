"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialService } from "@/services/social.service";
import { useAuthStore } from "@/store/AuthStore";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { PageLoader } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, MessageSquare, Repeat2, Trash2, Send, User, Image, Rss } from "lucide-react";
import toast from "react-hot-toast";
import { getApiError } from "@/lib/axios";
import { clsx } from "clsx";
import type { Post } from "@/types/social";

function PostCard({ post, onLike, onRepost, onDelete, currentUserId }: {
  post: Post;
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserId?: string;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const qc = useQueryClient();

  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => socialService.getComments(post.id),
    enabled: showComments,
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => socialService.addComment(post.id, content),
    onSuccess: () => { setComment(""); qc.invalidateQueries({ queryKey: ["comments", post.id] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  const initials = post.author?.fullName?.[0] ?? post.author?.firstName?.[0] ?? "?";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
            {initials || <User size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  {post.author?.fullName ?? `${post.author?.firstName ?? ""} ${post.author?.lastName ?? ""}`.trim()}
                </p>
                <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              {post.authorId === currentUserId && (
                <button onClick={() => onDelete(post.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <p className="mt-3 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post" className="mt-3 rounded-xl max-h-72 object-cover w-full" />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-slate-50 flex items-center gap-1">
        <button
          onClick={() => onLike(post.id)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            post.isLiked ? "bg-red-50 text-red-500" : "text-slate-500 hover:bg-slate-50 hover:text-red-500"
          )}
        >
          <Heart size={15} fill={post.isLiked ? "currentColor" : "none"} />
          {post.likesCount > 0 && post.likesCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            showComments ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
          )}
        >
          <MessageSquare size={15} />
          {post.commentsCount > 0 && post.commentsCount}
        </button>
        <button
          onClick={() => onRepost(post.id)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
            post.isReposted ? "bg-emerald-50 text-emerald-600" : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
          )}
        >
          <Repeat2 size={15} />
          {post.repostsCount > 0 && post.repostsCount}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-5 pb-4 space-y-3 border-t border-slate-50">
          <div className="pt-3 space-y-2">
            {comments?.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                  {c.author?.fullName?.[0] ?? c.author?.firstName?.[0] ?? "?"}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold text-slate-700">
                    {c.author?.fullName ?? `${c.author?.firstName ?? ""} ${c.author?.lastName ?? ""}`.trim()}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Фикри худро нависед..."
              className="flex-1 text-sm border-2 border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 transition-colors"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && comment.trim()) { e.preventDefault(); commentMutation.mutate(comment); } }}
            />
            <Button size="sm" onClick={() => comment.trim() && commentMutation.mutate(comment)} loading={commentMutation.isPending}>
              <Send size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedContent() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [localLikes, setLocalLikes] = useState<Set<string>>(new Set());

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => socialService.getPosts(),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => socialService.createPost({ content, imageUrl: imageUrl.trim() || undefined }),
    onSuccess: () => { 
      setNewPost(""); 
      setImageUrl("");
      qc.invalidateQueries({ queryKey: ["posts"] }); 
      toast.success("Пост интишор шуд!"); 
    },
    onError: (e) => toast.error(getApiError(e)),
  });

  const likeMutation = useMutation({
    mutationFn: socialService.likePost,
    onMutate: async (postId) => {
      setLocalLikes(prev => new Set(prev).add(postId));
      await qc.cancelQueries({ queryKey: ["posts"] });
      const prev = qc.getQueryData<Post[]>(["posts"]);
      qc.setQueryData<Post[]>(["posts"], (old) => 
        old?.map(p => p.id === postId ? { ...p, isLiked: true, likesCount: p.isLiked ? p.likesCount : p.likesCount + 1 } : p)
      );
      return { prev };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
    onError: (err, id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["posts"], ctx.prev);
      setLocalLikes(prev => { const n = new Set(prev); n.delete(id); return n; });
      toast.error(getApiError(err));
    }
  });

  const repostMutation = useMutation({
    mutationFn: socialService.repostPost,
    onSuccess: () => { toast.success("Repost шуд!"); qc.invalidateQueries({ queryKey: ["posts"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: socialService.deletePost,
    onSuccess: () => { toast.success("Нобуд карда шуд"); qc.invalidateQueries({ queryKey: ["posts"] }); },
    onError: (e) => toast.error(getApiError(e)),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <Rss size={22} className="text-indigo-500" />
          Лентаи хабарҳо
        </h1>

        {/* Create post */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
              {user?.fullName?.[0] ?? "?"}
            </div>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Дар чӣ фикр ҳастед?"
                rows={3}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="border-slate-100 bg-slate-50 focus:bg-white"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Линки сурат (URL)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-sm border-2 border-slate-100 bg-slate-50 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <Button
                  onClick={() => newPost.trim() && createMutation.mutate(newPost)}
                  loading={createMutation.isPending}
                  disabled={!newPost.trim()}
                  size="sm"
                  className="sm:w-auto w-full"
                >
                  <Send size={14} />
                  Интишор кардан
                </Button>
              </div>
              {imageUrl.trim() && (
                <div className="relative rounded-xl overflow-hidden border border-slate-100 mt-2">
                  <img src={imageUrl} alt="Preview" className="max-h-40 w-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : !posts?.length ? (
          <EmptyState icon={<Rss size={40} />} title="Лента холӣ аст" description="Аввалин постро эҷод кунед!" />
        ) : (
          <div className="space-y-4">
            {posts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={{...post, isLiked: post.isLiked || localLikes.has(post.id)}}
                onLike={(id) => likeMutation.mutate(id)}
                onRepost={(id) => repostMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return <AuthGuard><FeedContent /></AuthGuard>;
}
