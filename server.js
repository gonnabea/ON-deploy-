import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import SocketIO from "socket.io"
import morgan from "morgan"
import { socketController } from "./socket-server/socketContoller"
import mysql from "mysql2"
import db from "./models"
import mainRouter from "./router/mainRouter"
import userRouter from "./router/userRouter"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import dotenv from "dotenv"
import "./passport"
import flash from "connect-flash"
import localsMiddlewares from "./middleware"
import path from "path"
import MySQLStore from "express-mysql-session"

const PORT = process.env.PORT || 5000 // dotenv 쓰면 프록시가 망가짐
const app = express()

dotenv.config()
//////////////////////////////////////// 순수 SQL 테스트 ///////////////////////////////////////////////
// MySQL 컨넥션 만들기
const MySQL = mysql.createConnection({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b8871d0c79abc7",
  password: "fb562258",
  database: "heroku_e7a4a426f1b1fd6",
})

// MySQL 컨넥트
MySQL.connect((err) => {
  if (err) throw err
  console.log("Node connected to MySQL server")
})

// DB 생성
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE nodemysql"
  MySQL.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send("database created...")
  })
})

// MySQL 테이블 생성
app.get("/createpoststable", (req, res) => {
  let sql =
    "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))"
  MySQL.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send("Posts table created...")
  })
})

// "post" 테이블에 1 삽입
app.get("/addpost2", (req, res) => {
  let post = { title: "Post One", body: "This is post number two" }
  let sql = "INSERT INTO posts SET ?"
  MySQL.query(sql, post, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send("Post 2 added...")
  })
})

// SELECT "posts" 테이블
app.get("/getposts", (req, res) => {
  let sql = "SELECT * FROM posts"
  MySQL.query(sql, (err, results) => {
    if (err) throw err
    console.log(results)
    res.send("Posts fetched...")
  })
})

// Select single post
app.get("/getpost/:id", (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`
  MySQL.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send("Post fetched...")
  })
})

// Update post
app.get("/updatepost/:id", (req, res) => {
  let newTitle = "Updated Title"
  let sql = `UPDATE posts set title = '${newTitle}' WHERE id = ${req.params.id}`
  MySQL.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send("Post updated...")
  })
})

// Delete post
app.get("/deletepost/:id", (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`
  MySQL.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send("Post deleted...")
  })
})

//////////////////////////////////////// 순수 SQL 테스트 ///////////////////////////////////////////////

// CORS 오류 해결법

const whitelist = [
  "https://our-now.herokuapp.com",
  "http://localhost:3000",
  "http://localhost:3000/exhibition",
  "https://jiwondev.netlify.app",
  "https://jiwondev.netlify.app/exhibition",
]
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error("Not allowed by CORS"))
    }
  },
}
app.use(cors(corsOptions))
///////////////////////////// peerjs 서버 만들기 /////////////////////
// const httpServer = http.createServer(app)
// const peerServer = ExpressPeerServer(httpServer, {
//   debug: true,
// })

// app.use("/peerjs", peerServer)
// peerServer.listen(9000)
///////////////////////////////////////////////////////////////////////

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")))
  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
} // 헤로쿠에 리액트 프론트를 배포하기 위함

app.use(helmet())
app.disable("x-powered-by") // helmet으로 x-powered-by가 disable되지 않아 수동설정
app.use(express.static("public"))
app.use(cookieParser())
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    store: new MySQLStore({
      host: "us-cdbr-east-02.cleardb.com",
      user: "b8871d0c79abc7",
      password: "fb562258",
      database: "heroku_e7a4a426f1b1fd6",
    }),
    secret: "foo",
    resave: false,
    saveUninitialized: true,
    proxy: true,
  })
)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")))
}

app.use(passport.initialize())
app.use(passport.session())
app.use(morgan("dev"))
app.use(flash())
app.use(localsMiddlewares)
app.use(mainRouter)
app.use(userRouter)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

db.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`express is running on ${PORT}`)
  })
  const io = SocketIO.listen(server)

  io.on("connection", (socket) => socketController(socket))
})
