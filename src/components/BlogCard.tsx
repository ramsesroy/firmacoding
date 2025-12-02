import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article
      className={`group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {post.image && (
          <div className={`relative overflow-hidden ${featured ? "h-64 lg:h-80" : "h-48"}`}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {featured && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </div>
            )}
          </div>
        )}
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{post.readTime} min read</span>
          </div>
          <h2
            className={`font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors ${
              featured ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
            }`}
          >
            {post.title}
          </h2>
          <p className={`text-gray-600 mb-4 line-clamp-2 ${featured ? "text-lg" : "text-base"}`}>
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
              </div>
            </div>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
              Read more
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

