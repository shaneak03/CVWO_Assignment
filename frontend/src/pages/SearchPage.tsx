import React, { useState, useEffect } from "react";
import { TextField, Typography, Box } from "@mui/material";
import PostCard from "../components/PostCard";

const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

interface Post {
  id: number;
  title: string;
  content: string;
  user_id: string;
  movie: string;
  tags: string[];
  spoiler: boolean;
  votes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface PostWithUsername extends Post {
  username: string;
}

interface SearchPageProps {
  posts: Post[];
}

function SearchPage({ posts }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [postsWithUsernames, setPostsWithUsernames] = useState<PostWithUsername[]>([]);

  useEffect(() => {
    async function fetchUsernames() {
      const postsWithUsernames = await Promise.all(
        posts.map(async (post) => {
          const userResponse = await fetch(`${ENDPOINT}/api/users/${post.user_id}`);
          const userData = await userResponse.json();
          return { ...post, username: userData.username };
        })
      );
      setPostsWithUsernames(postsWithUsernames);
    }
    fetchUsernames();
  }, [posts]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value.toLowerCase());
  }

  const filteredPosts = postsWithUsernames.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
  );

  return (
    <>
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
          {filteredPosts.map((post, index) => {
            return (
              <PostCard
                key={index}
                id={post.id} 
                title={post.title}
                content={post.content}
                tags={post.tags}
                spoiler={post.spoiler}
                username={post.username}
                votes={post.votes}
                hasUpvoted={post.hasUpvoted}
                hasDownvoted={post.hasDownvoted}
              />
            );
          })}
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

