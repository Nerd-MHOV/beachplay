import "dotenv/config"
import express from "express"
import morgan from "morgan"

import Queue from "./app/lib/Queue"
import {ExpressAdapter} from "@bull-board/express";
import {createBullBoard} from "@bull-board/api";
import {BullAdapter} from "@bull-board/api/bullAdapter";

import {v2 as cloudinary} from "cloudinary"
import configCloudinary from "./config/cloudinary"
import replayCtrl from "./app/controllers/replayCtrl";
import authCtrl from "./app/controllers/authCtrl";
cloudinary.config(configCloudinary);

const port = process.env.PORT || 3333
const routeBullBoard = "/admin/queues";


// Bull-Board config
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath(routeBullBoard)
createBullBoard({
    queues: Queue.queues.map(queue => new BullAdapter(queue.bull)),
    serverAdapter
})

const app = express()
app.use(express.json())
// app.use(morgan('dev'))

// Rota para salvar os últimos 30 segundos em um arquivo output.mp4
app.get('/save-replay/:camID/:clientID', replayCtrl.saveReplay);


app.get("/verify", authCtrl.verify)

app.get("/verify_id", authCtrl.verifyId)

app.get("/qr", authCtrl.qr)

// bull route
app.use(routeBullBoard, serverAdapter.getRouter())

app.listen(port, () => {
    console.log(`Server is running in port: ${port}`)
})