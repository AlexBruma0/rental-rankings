import { useState, useEffect } from "react";
import InfoCard from "components/InfoCard";
import Review from "components/review";
import { useToast } from "@chakra-ui/react";
import { genericErrorHandler } from "utils";
import { useNavigate, useParams } from "react-router-dom";
import { Comment, Post } from "types";
import { Spinner } from "@chakra-ui/react";

const API_URL = `${import.meta.env.VITE_API_SERVER_URL}/api/v1`;

/**
 * Remove modal from InfoCard and bring to Property
 * Need to have it in property so we can
 *
 * Pass post data from UserHome
 *
 */
const Property = () => {
  const { id } = useParams();
  const toast = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState<null | boolean>(null);
  const [loadingComments, setLoadingComments] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  const [comment, setComment] = useState<Comment>({
    authorId: "",
    content: "",
    createdAt: new Date(),
    id: "",
    postId: "",
    updatedAt: new Date(),
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    setLoadingPost(true);
    setError(null);
    getPost()
      .then((data) => {
        setPost(data.post);
        setLoadingPost(false);
      })
      .catch(() => {
        setLoadingPost(false);
        setError("An error occurred.");
      });
    setLoadingComments(true);
    setError(null);
    getPostComments()
      .then((data) => {
        setComments(data);
        setLoadingComments(false);
      })
      .catch(() => {
        setLoadingComments(false);
        setError("An error occurred.");
      });
  }, [comments.length]);

  const updateComments = () => {
    setComments([...comments, comment]);
    postComment();
  };
  const getPost = async () => {
    try {
      const response = await fetch(`${API_URL}/postings/${id}`);
      const json = await response.json();
      !json.post ? notFound() : void 0;
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const removeComment = (commentId: string | undefined): void => {
    const newCommentArray = comments.filter((comment) => comment.id !== commentId);
    setComments(newCommentArray);
  };

  const updateAfterEdit = (commentId: string): void => {
    const prevComment: Comment | undefined = comments.find((c) => c.id === commentId);
    const newComment: Comment = {
      authorId: prevComment?.authorId || "",
      content: comment.content,
      createdAt: prevComment?.createdAt || new Date(),
      id: prevComment?.id || "",
      postId: prevComment?.postId || "",
      updatedAt: prevComment?.updatedAt || new Date(),
    };
    const newCommentArray = comments
      .filter((comment) => comment.id !== commentId)
      .concat(newComment);
    setComments(newCommentArray);
  };

  const editComment = async (commentId: string | undefined) => {
    const token = "Bearer " + localStorage.getItem("BEARER_TOKEN")?.toString();
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          content: comment.content,
        }),
      });
      if (response.status == 201) {
        updateAfterEdit(commentId || "");
      }
    } catch (err) {
      genericErrorHandler(err, toast);
    }
  };

  const deleteReview = async (commentId: string | undefined) => {
    const token = "Bearer " + localStorage.getItem("BEARER_TOKEN")?.toString();
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.status == 201) {
        removeComment(commentId);
      }
    } catch (err) {
      genericErrorHandler(err, toast);
    }
  };

  const postComment = async () => {
    const token = "Bearer " + localStorage.getItem("BEARER_TOKEN")?.toString();

    try {
      await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          content: comment.content,
          postId: post?.id,
          authorId: token,
        }),
      });
    } catch (err) {
      genericErrorHandler(err, toast);
    }
  };

  const getPostComments = async () => {
    try {
      const response = await fetch(`${API_URL}/postings/${id}`);
      const json = await response.json();
      return json.post.comments;
    } catch (error) {
      genericErrorHandler(error, toast);
      return [];
    }
  };

  const notFound = () => {
    toast({
      title: "Page not found",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };
  return (
    <>
      {loadingPost && <Spinner size="xl" ml="45%" mt="30%" />}
      {!loadingPost && (
        <>
          {post && (
            <InfoCard
              comment={comment}
              setComment={setComment}
              updateComments={updateComments}
              key={99}
              post={post}
            />
          )}
          <br />
          {loadingComments && <Spinner size="xl" ml="45%" />}
          {comments && (
            <>
              <div id="comments">
                {comments.map((comment, i) => (
                  <Review
                    key={i}
                    comment={comment}
                    authorId={comment.authorId ? comment.authorId : "No ID"}
                    deleteReview={() => deleteReview(comment.id)}
                    setComment={setComment}
                    editComment={() => editComment(comment.id)}
                  />
                ))}
              </div>
            </>
          )}
          {error && <p>{error}</p>}
        </>
      )}
    </>
  );
};

export default Property;
