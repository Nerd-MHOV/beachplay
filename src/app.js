import "dotenv/config"
import express from "express"
import morgan from "morgan"

import Queue from "./app/lib/Queue"
import {ExpressAdapter} from "@bull-board/express";
import {createBullBoard} from "@bull-board/api";
import {BullAdapter} from "@bull-board/api/bullAdapter";

import CamCtrl from "./app/controllers/CamCtrl";
import {v2 as cloudinary} from "cloudinary"
import configCloudinary from "./config/cloudinary"
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
app.use(morgan('dev'))

app.get("/record/:cam/:id", CamCtrl.record);
app.get("/stop/:cam", CamCtrl.stop);

// bull route
app.use(routeBullBoard, serverAdapter.getRouter())

app.listen(port, () => {
    console.log(`Server is running in port: ${port}`)
})