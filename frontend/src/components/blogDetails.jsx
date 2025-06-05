import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8002/api/get-blog/${id}`);
        const result = await response.json();
        console.log("Fetched Data:", result);
        setBlog(result.data);
        // Safely parse and format date
        const createdAt = new Date(result.data.createdAt);
        const isValidDate = !isNaN(createdAt.getTime());
        if (isValidDate){
          const formatted = createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setFormattedDate(formatted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  fetchData();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="portfolio-blog">
      <h3>{blog.title}</h3>
      <h4>Author Name: {blog.auther}</h4>
      {formattedDate && <p>{formattedDate}</p>}
      <div className="portfolio-blog-image">
        <img src={`http://localhost:8002/${blog.image}`} alt={blog.title} />
      </div>
      <p className="blog-description">{blog.decription}</p>
    </div>
  );
};

export default BlogDetails;
