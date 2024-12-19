import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { ENDPOINT } from "../App";

function AddWebPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function handleTitle(event: React.ChangeEvent<HTMLInputElement>) {
        const title = event.target.value
        setTitle(title);
    }
    

    function handleContent(event: React.ChangeEvent<HTMLInputElement>) {
        const content = event.target.value
        setContent(content);
    }

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const webpost = {
            author: "me",
            title: title,
            content: content,
            date: new Date(),
        }
        try {
            const response = await fetch(`${ENDPOINT}/api/webposts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(webpost),
                credentials: "include"
            });

            const data = await response.json(); 

            console.log(data);

            setContent("");
            setTitle("");
        } catch (error) {
            console.error("Error posting web post:", error);
        }

    }

    return (
        <div>
            <Grid
                container
                direction="column"
                style={{ height: '100vh' }}
                alignItems="center">
                <Typography variant="h2" style={{ marginTop:"4rem", marginBottom: "1rem" }}>
                    Add a Post
                </Typography>
                <form style={{ width: "50%", textAlign: "center" }} onSubmit={submit}>
                    <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    id="title"
                    onChange={handleTitle}
                    value={title}
                    />
                    <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    id="content"
                    onChange={handleContent}
                    value={content}
                    InputProps={{
                        sx: { height: "500px" }, 
                      }}
                    />
                    <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    >
                    Submit Post
                    </Button>
                </form>
            </Grid>
        </div>);
}

export default AddWebPost;