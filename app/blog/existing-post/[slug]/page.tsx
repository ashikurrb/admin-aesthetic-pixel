"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import BlogContentViewer from "@/app/components/BlockNoteViewer";

interface Blog {
  _id: string;
  title: string;
  jsonContent: string;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/blog/get-blog/${slug}`,
        );
        setBlog(data.blogPost);
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <p className="text-white">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-white">Blog not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {blog && (
        <>
          <h1 className="text-3xl font-bold text-white mb-6">{blog.title}</h1>

          <BlogContentViewer content={blog.jsonContent} />
        </>
      )}
    </div>
  );
}
