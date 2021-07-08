/* eslint-disable no-undef */
const healthRouter = require("express").Router()

healthRouter.get("/health", (request, response) => {
  response.send("ok")
})

healthRouter.get("/version", (request, response) => {
  response.send("")
})
