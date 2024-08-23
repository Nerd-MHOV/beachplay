import ffmpeg from "../lib/ffmpeg";
import Queue from "../lib/Queue";

export default {
    key: "GetReplay",
    options: {
        delay: 8000,
        attempts:3,
    },
    async handle({ data }) {
        const {
            logFile,
            outputFile
        } = data;
        ffmpeg.saveOutputVideo(logFile, outputFile).then(async () => {
            await Queue.add("AddWatermark", {
                path: outputFile
            })
        })
       
    }
}