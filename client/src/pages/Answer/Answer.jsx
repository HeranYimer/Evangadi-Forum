import React, { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import classes from "./Answer.module.css";
import { useParams } from "react-router-dom";
import { BsPatchQuestionFill } from "react-icons/bs";

function Answer() {
  const { qid } = useParams();
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const answerRef = useRef("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const question_response = await axios.get(`/questions/${qid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(question_response.data.question);

        const answer_response = await axios.get(`answers/${qid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswer(answer_response.data.Answer);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [qid, token]); // removed postAnswer from deps, added qid & token

  async function postAnswer(e) {
    e.preventDefault();

    const answerValue = answerRef.current.value.trim();

    if (answerValue.length < 10) {
      setErrorMsg("Answer must be at least 10 characters long.");
      return;
    }

    try {
      await axios.post(
        "/answers",
        { answer: answerValue, question_id: qid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      answerRef.current.value = "";
      setErrorMsg("");
      setSuccessMsg("Answer posted successfully!");

      setTimeout(() => setSuccessMsg(""), 3000); // Auto-clear success message after 3s

      // Optionally, refresh answers after posting
      const answer_response = await axios.get(`answers/${qid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswer(answer_response.data.Answer);
    } catch (error) {
      console.log(error);
      setErrorMsg(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className={classes.main_container}>
      <div className={classes.container}>
        <div className={classes.question}>
          <h3 className={classes.title}>
            <BsPatchQuestionFill /> {question?.title}
          </h3>
          <p>Tag: {question?.tag}</p>
          {/* <p>Asked By: {question?.asked_by?.first_name}</p> */}
          <p>{question?.description}</p>
        </div>

        <div className={classes.answer}>
          <h3>Recent Answers</h3>

          {answer.length === 0 && (
            <div className={classes.no_answers}>
              <p>No answers yet. Be the first to answer this question!</p>
            </div>
          )}

          <div className={classes.answer_list}>
            {answer.map((item) => {
              const icon = item.username[0].toUpperCase();
              return (
                <div key={item.answer_id}>
                  <div className={classes.single_answer}>
                    <div className={classes.profile}>
                      <div className={classes.avatar}>{icon}</div>
                      <span>{item.username}</span>
                    </div>
                    <p>{item.answer}</p>
                  </div>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>

        <div className={classes.post_answer}>
          <h3 className={classes.title}>Answer this question</h3>
          <form onSubmit={postAnswer}>
            <textarea
              ref={answerRef}
              placeholder="Describe your answer here!"
              onChange={() => {
                setErrorMsg("");
                setSuccessMsg("");
              }}
            ></textarea>
            <button type="submit">Post Answer</button>
            {successMsg && <p className={classes.success}>{successMsg}</p>}
            {errorMsg && <p className={classes.error}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Answer;
