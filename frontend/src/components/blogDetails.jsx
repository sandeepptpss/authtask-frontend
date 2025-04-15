import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
 try {
    const response = await fetch(`http://localhost:8002/api/get-blog/${id}`);
    const result = await response.json();
        console.log("Fetched Data:", result);
        setBlog(result.data); 
 } catch (error) {
    console.error("Error fetching data:", error);
 }
};
fetchData();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="portfolio-blog">
      <h2> {blog.title}</h2>
      <h4> {blog.auther}</h4>
      <div className="portfolio-blog-image">
        <img src={`http://localhost:8002/${blog.image}`} alt={blog.title} />
      </div>
      <p>{blog.decription}</p>
    </div>
  );
};

export default BlogDetails;
