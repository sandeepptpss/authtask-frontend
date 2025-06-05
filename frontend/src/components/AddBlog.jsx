import '../assets/blog.css';
import React, { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [decription, setDecription] = useState("");
  const [auther, setAuther] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }
  const blogSubmitData = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("decription", decription);
    formData.append("auther", auther);
    if(image) {
    formData.append("image", image);
    }
    try {
      const result = await fetch("http://localhost:8002/api/add-blog", {
        method: "POST",
        body: formData,
      });
      if (result.ok) {
        setSuccessMessage('Your blog has been added successfully!');
        setTitle("");
        setDecription("");
        setAuther("");
        setImage(null);
      } else {
       setSuccessMessage('There was an error adding your blog. Please try again');
      }
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage('An error occurred. Please try again later');
    }
  }
  return(
    <div>
      <h2>Blog Page</h2>
      <form onSubmit={blogSubmitData}>
        <div>
          <input type="text" value={title} onChange={setTitle} required placeholder='Title' />
        </div>
        <div>
        <ReactQuill
          theme="snow"
          value={decription}
          onChange={setDecription}
          placeholder="Description"
        />
        </div>
        <div>
          <input type="text" value={auther} name={auther} onChange={setAuther} required placeholder='Auther'/>
        </div>
        <div>
        <input type="file" onChange={handleImageChange} accept="image/*"  placeholder='Image'/>
        </div>
        <button type="submit">Create Blog</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
export default AddBlog;