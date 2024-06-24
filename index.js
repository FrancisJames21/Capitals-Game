import express from "express";
import bodyParser from "body-parser"; 
import pg from "pg";

const db = new pg.Client({
  user : "postgres",
  host: "localhost",
  database : "World",
  password :"POST@123",
  port :"5432",
});

const app = express();
const port = 5000;

db.connect();

let quiz = [];

db.query("SELECT * FROM capitals",(err,res)=>{
  if (err){
    console.log("Error executing query",err.stack);
  }else {
    quiz= res.rows;
  }
});

let totalCorrect = 0;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let currentQuestion = {};

app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }
  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}


app.listen(port,()=>{
  console.log(`server is running at http://localhost:${port}`)
})