import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/formatter";
import { Button, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const loggedInUserId = localStorage.getItem("user_id");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response?.data?.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const questionsToShow = filteredQuestions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const confirmDelete = (question_id) => {
    setQuestionToDelete(question_id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/questions/${questionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions((prev) =>
        prev.filter((q) => q.question_id !== questionToDelete)
      );
      setQuestionToDelete(null);
    } catch (error) {
      alert("Failed to delete question.");
      setQuestionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setQuestionToDelete(null);
  };

  const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className={classes.confirmModalBackdrop}>
      <div className={classes.confirmModalContent}>
        <p>{message}</p>
        <div className={classes.confirmModalActions}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className={classes.homepage}>
      <div className={classes.head}>
        <Link to="/askquestion">
          <button>Ask Question</button>
        </Link>
        <div className={classes.user}>
          <p>Welcome: {username}</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="User Icon"
          />
        </div>
      </div>

      <div className={classes.body}>
        <div className={classes.searchContainer}>
          <input
            type="text"
            placeholder="Search questions..."
            className={classes.searchInput}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className={classes.headerRow}>
          <h2>Questions</h2>
          {totalPages > 1 && (
            <div className={classes.pagination}>
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={classes.paginationButton}
              >
                Previous
              </Button>
              <span className={classes.pageInfo}>
                Page {currentPage} / {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={classes.paginationButton}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div className={classes.questions}>
          {questionsToShow.map((item) => {
            const favicon = item?.username[0].toUpperCase();
            const isOwner = item?.user_id?.toString() === loggedInUserId;

            return (
              <Link to={`/answer/${item.question_id}`} key={item.question_id}>
                <div className={classes.single}>
                  <div className={classes.profile}>
                    <p className={classes.avatar}>{favicon}</p>
                    <span>{item.username}</span>
                  </div>
                  <div className={classes.title}>{item.title}</div>
                  <div className={classes.extra}>
                    <p>{timeAgo(item.time)}</p>
                  </div>

                  {isOwner && (
                    <div className={classes.actionButtons}>
                      <Link
                        to={`/editquestion/${item.question_id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className={classes.editBtn}>
                          <FaEdit />
                          Edit
                        </button>
                      </Link>
                      <button
                        className={classes.deleteBtn}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          confirmDelete(item.question_id);
                        }}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {questionToDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default HomePage;
