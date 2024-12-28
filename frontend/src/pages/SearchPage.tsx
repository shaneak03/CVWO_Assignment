import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts] = useState([
    {
      title: "Introduction to React",
      content: "React is a JavaScript library for building user interfaces...",
      tags: ["React", "JavaScript", "Frontend"],
      spoiler: false,
      creator: "John Doe",
    },
    {
      title: "Advanced CSS Techniques",
      content: "CSS is used to style web pages and create responsive designs...",
      tags: ["CSS", "Web Design", "Frontend"],
      spoiler: false,
      creator: "Jane Smith",
    },
    {
      title: "Understanding TypeScript",
      content: "TypeScript extends JavaScript by adding types...",
      tags: ["TypeScript", "JavaScript", "Programming"],
      spoiler: false,
      creator: "Alice Johnson",
    },
  ]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value.toLowerCase());
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
  );

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "2rem" }}>
        <Typography variant="h3" sx={{ marginBottom: "2rem", textAlign: "center" }}>
          Search Posts
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for posts by title, content, or tags..."
          onChange={handleSearchChange}
          value={searchQuery}
          sx={{ marginBottom: "2rem" }}
        />
        <Box
          display="flex"
          flexDirection="column" 
          alignItems="center" 
          gap={3}
        >
          {filteredPosts.map((post, index) => (
            <PostCard
              key={index}
              title={post.title}
              content={post.content}
              tags={post.tags}
              spoiler={post.spoiler}
              creator={post.creator}
            />
          ))}
          {filteredPosts.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
              No posts found.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export default SearchPage;

