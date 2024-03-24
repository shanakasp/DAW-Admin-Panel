import {
  AddCircleOutline as AddCircleOutlineIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  Button,
  CircularProgress, // Make sure CircularProgress is imported
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

function QuestionForm() {
  const { id } = useParams();
  const [categoryId, setCategoryId] = useState(id);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      questionType: "dropdown",
      options: [{ optionText: "" }, { optionText: "" }, { optionText: "" }],
      answer: false,
      answerKey: "",
      point: 0,
      open: true,
      required: false,
    },
  ]);

  const [documentName, setDocumentName] = useState("Add Questions");
  const [documentDesc, setDocumentDesc] = useState("Form Description");

  const [loading, setLoading] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  // New state variables for error handling
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle error Snackbar close
  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
  };

  // Function to set and show error message in Snackbar
  const showErrorSnackbar = (message) => {
    setErrorMessage(message);
    setErrorSnackbarOpen(true);
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const changeQuestion = (text, i) => {
    const newQuestions = [...questions];
    newQuestions[i].questionText = text;
    setQuestions(newQuestions);
  };

  const changeOptionValue = (text, i, j) => {
    const newQuestions = [...questions];
    newQuestions[i].options[j].optionText = text;
    setQuestions(newQuestions);
  };

  const removeOption = (i, j) => {
    const removeOptionQuestions = [...questions];
    if (removeOptionQuestions[i].options.length > 1) {
      removeOptionQuestions[i].options.splice(j, 1);
      setQuestions(removeOptionQuestions);
    }
  };

  const addOption = (i) => {
    const addnewQuestions = [...questions];
    if (addnewQuestions[i].options.length < 5) {
      addnewQuestions[i].options.push({
        optionText: "",
      });
      setQuestions(addnewQuestions);
    }
  };

  const deleteQuestion = (i) => {
    const updatedQuestions = questions.map((question, index) =>
      index === i ? { ...question, options: [] } : question
    );
    setQuestions(updatedQuestions);
  };

  const saveQuestions = () => {
    if (questions.length === 0) {
      console.error("No questions to save.");
      return;
    }

    // Display loading animation
    setLoading(true);

    const saveQuestionsData = {
      categoryId: categoryId,
      title: questions[0].questionText,
      type: "dropdown",
      values: [],
    };

    const textQuestions = questions.filter(
      (ques) => ques.questionType === "text"
    );

    if (textQuestions.length > 0) {
      saveQuestionsData.type = "text";
      saveQuestionsData.values = textQuestions.map((ques) => ({
        value: ques.answerText,
      }));
    } else {
      if (questions[0].options && questions[0].options.length > 0) {
        saveQuestionsData.values = questions[0].options.map((option) => ({
          value: option.optionText,
        }));
      } else {
        // Hide loading animation
        setLoading(false);

        console.error("Dropdown question should have options.");
        return;
      }
    }

    if (!saveQuestionsData.title) {
      // Hide loading animation
      setLoading(false);

      console.error("Question is required.");
      showErrorSnackbar("Question is required.");
      return;
    }
    if (!saveQuestionsData.type) {
      // Hide loading animation
      setLoading(false);

      console.error("Type is required.");
      return;
    }
    // Check if there are any answers
    const hasAnswers =
      questions.some(
        (ques) =>
          ques.questionType === "text" &&
          ques.answerText !== undefined &&
          ques.answerText.trim() !== ""
      ) ||
      (questions[0].options &&
        questions[0].options.some(
          (option) =>
            option.optionText !== undefined && option.optionText.trim() !== ""
        ));

    if (!hasAnswers && saveQuestionsData.type === "dropdown") {
      // Hide loading animation
      setLoading(false);

      console.error("Answers are mandatory for dropdown questions.");
      showErrorSnackbar("Answers are mandatory for dropdown questions.");
      return;
    }

    fetch("https://docback.hasthiya.org/questions/addQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saveQuestionsData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide loading animation
        setLoading(false);

        console.log("Questions saved successfully:", data);

        setCategoryId(id);
        setQuestions([
          {
            questionText: "",
            questionType: "dropdown",
            options: [
              { optionText: "" },
              { optionText: "" },
              { optionText: "" },
            ],
            answer: false,
            answerKey: "",
            point: 0,
            open: true,
            required: false,
          },
        ]);
        setDocumentName("Add Questions");
        setDocumentDesc("Form Description");

        // Show success message using Snackbar
        setSuccessSnackbarOpen(true);
      })
      .catch((error) => {
        // Hide loading animation
        setLoading(false);

        console.error("Error saving questions:", error);

        // Handle the error and show an error message
        alert("Error saving questions. Please try again.");
      });
  };

  const changeQuestionType = (type, i) => {
    const newQuestions = [...questions];
    newQuestions[i].questionType = type;
    setQuestions(newQuestions);
  };

  const changeAnswerText = (text, i) => {
    const newQuestions = [...questions];
    newQuestions[i].answerText = text;
    setQuestions(newQuestions);
  };

  const questionUI = () => {
    return questions.map((ques, i) => (
      <Accordion key={i} expanded={ques.open}>
        <AccordionDetails>
          <div className="mb-2" style={{ width: "300px" }}>
            <TextField
              label="Question"
              variant="outlined"
              value={ques.questionText}
              onChange={(e) => changeQuestion(e.target.value, i)}
              style={{ width: "300px" }}
            />
          </div>

          <div>
            <Select
              label="Question Type"
              value={ques.questionType}
              onChange={(e) => changeQuestionType(e.target.value, i)}
              style={{
                marginLeft: "00px",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <MenuItem value="dropdown">Dropdown</MenuItem>
              <MenuItem value="text">Text</MenuItem>
            </Select>
          </div>
          {ques.questionType === "dropdown" &&
            ques.options.map((op, j) => (
              <div className="mb-2" key={j}>
                <TextField
                  label={`Option ${j + 1}`}
                  variant="outlined"
                  value={op.optionText}
                  onChange={(e) => changeOptionValue(e.target.value, i, j)}
                />
                <IconButton onClick={() => removeOption(i, j)}>
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
          {ques.questionType === "text" && (
            <div>
              <TextField
                label="Answer as Text"
                variant="outlined"
                value={ques.answerText || ""}
                onChange={(e) => changeAnswerText(e.target.value, i)}
              />
            </div>
          )}
          {ques.questionType === "dropdown" && (
            <IconButton onClick={() => addOption(i)}>
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </AccordionDetails>
        <div className="m-lg-2">
          <IconButton onClick={() => deleteQuestion(i)}>
            <DeleteOutlineIcon />
          </IconButton>
        </div>
      </Accordion>
    ));
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3>Add Questions</h3>
            {/* Loading animation */}
            {loading && <CircularProgress style={{ margin: "20px" }} />}
            {/* Conditionally render the save button at the top if dropdown options length is more than 3 */}
            {questions[0].options.length > 3 && (
              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveQuestions}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Conditionally render the save button at the bottom if dropdown options length is less than or equal to 3 */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            {questionUI()}
            {questions[0].options.length <= 3 && (
              <div className="d-grid gap-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveQuestions}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={handleSuccessSnackbarClose}
        >
          Question added successfully
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={handleErrorSnackbarClose}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default QuestionForm;
