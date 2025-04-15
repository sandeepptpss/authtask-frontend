import '../assets/blog.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const showblog = async () => {
        const responseApi = await fetch(`http://localhost:8002/api/view-blog`);
        const fetchData = await responseApi.json();
        setBlogs(fetchData.data);
    };
    useEffect(() => {
        showblog();
    },[]);
    return (
        <div className="main-blogs">
            {blogs.map((blogItem, i)=>{
                const createdAt = new Date(blogItem.createdAt);
                const isValidDate = !isNaN(createdAt.getTime());
                const formattedDate = isValidDate
                    ? createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '';
                return (
                    <div className="blog-item-inner" key={i}>
                          {<p>{formattedDate}</p>}
                        <h3>{blogItem.title.slice(0, 50)}...</h3>
                        <h5>{blogItem.auther}</h5>
                        <img 
                            src={`http://localhost:8002/${blogItem.image}`} 
                            alt={blogItem?.title} 
                            className="blogs-image" 
                        />
                      <div className="blog-description">
                             {blogItem.decription.slice(0, 90)}…
                        </div> 
                      <Link className="live-demo-link" to={`/blog-details/${blogItem._id}`} rel="noopener noreferrer">
                        View More
                      </Link>
                    </div>
                );
            })}
        </div>
    );
};
export default Blog;