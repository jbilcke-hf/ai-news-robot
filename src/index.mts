
import express from "express"

import { main } from "./main.mts"

const app = express()
const port = 7860

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
})

process.on('uncaughtException', (error: Error) => {
  console.error(`Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
})

// fix this error: "PayloadTooLargeError: request entity too large"
// there are multiple version because.. yeah well, it's Express!
// app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// ask the robot to sync a specific channel,
// or all channels of the platform
// (the admin api key is required for the later)
app.get("/", async (req, res) => {
  res.status(200)
  res.write("Server seems fine.")
  res.end()
})


app.listen(port, () => {
  console.log(`Open http://localhost:${port}`)
  main()
})