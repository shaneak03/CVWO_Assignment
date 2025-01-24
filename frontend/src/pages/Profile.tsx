import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import supabase from "../supabase";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Review {
  id: number;
  movie_title: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface UserProfile {
  username: string;
  profile_picture: string;
}

function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      const { data, error } = await supabase.auth.getUser();
      const user = data.user;
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username, profile_picture")
        .eq("id", user?.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        setUserProfile(profileData);
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

  return (
    <Box sx={{ padding: 3 }}>
      {userProfile && (
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Avatar
            src={userProfile.profile_picture}
            alt={userProfile.username}
            sx={{ width: 80, height: 80, marginRight: 2 }}
          />
          <Typography variant="h4">{userProfile.username}</Typography>
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
                <Typography variant="body1">{review.comment}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Profile;
