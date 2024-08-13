import "dotenv/config"
import Queue from "./app/lib/Queue"
import {v2 as cloudinary} from "cloudinary"
import configCloudinary from "./config/cloudinary"
cloudinary.config(configCloudinary);

Queue.process();