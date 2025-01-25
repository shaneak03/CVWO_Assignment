import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
  spoiler: boolean;
  movie: string;
}

interface Review {
  id: number;
  movie_title: string;
  rating: number;
  content: string;
  created_at: string;
  spoiler: boolean; 
}

interface UserProfile {
  username: string;
  email: string;
}

function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      const { data, error } = await supabase.auth.getUser();
      const user = data.user;
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error("Failed to get session");
        }

        const response = await fetch(`${ENDPOINT}/api/users/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        });
        const responseText = await response.text(); // Get response text
        console.log("Response Text:", responseText); // Log response text
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${responseText}`);
        }
        const profileData = JSON.parse(responseText); // Parse response text as JSON
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    async function fetchPosts() {
      const { data, error } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id);

      if (postsError) {
        console.error("Error fetching posts:", postsError);
      } else {
        setPosts(postsData);
      }
    }

    async function fetchReviews() {
      const { data, error } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id);

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      } else {
        setReviews(reviewsData);
      }
    }

    fetchUserProfile();
    fetchPosts();
    fetchReviews();
  }, []);

  async function deletePost(postId: number) {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        throw new Error("Failed to get session");
      }

      const response = await fetch(`${ENDPOINT}/api/webposts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  async function deleteReview(reviewId: number) {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        throw new Error("Failed to get session");
      }

      const response = await fetch(`${ENDPOINT}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  return (
    <Box sx={{ padding: 3 }}>
      {userProfile && (
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Avatar
            alt={userProfile.username}
            sx={{ width: 80, height: 80, marginRight: 2 }}
          />
          <Typography variant="h4">{userProfile.username}</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginLeft: 2 }}>
            {userProfile.email}
          </Typography>
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Posts
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(post.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{post.content}</Typography>
                <Button
                  variant="outlined"
                  sx={{ marginTop: 2 }}
                  onClick={() => navigate(`/edit-webpost`, { state: { postId: post.id, title: post.title, content: post.content, tags: post.tags, spoiler: post.spoiler, movie: post.movie } })}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginTop: 2, marginLeft: 1 }}
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Reviews
      </Typography>
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{review.movie_title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">Rating: {review.rating}</Typography>
                <Typography variant="body1">{review.content}</Typography>
                <Button
                  variant="outlined"
                  sx={{ marginTop: 2 }}
                  onClick={() => navigate(`/edit-review`, { state: { reviewId: review.id, comment: review.content, rating: review.rating, spoiler: review.spoiler, movie_title: review.movie_title } })}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginTop: 2, marginLeft: 1 }}
                  onClick={() => deleteReview(review.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Profile;
