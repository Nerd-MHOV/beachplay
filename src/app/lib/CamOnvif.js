import onvif from "node-onvif"
import {format} from "date-fns";
import {recorders} from "./Recorders"
import Recorder from "rtsp-video-recorder"
import { RecorderEvents } from "rtsp-video-recorder";
export default {
    async startRecord(cam, client) {
        console.log("[ INFO ] - (startRecord) - starting....")
        console.log(cam);
        const camId = `cam${cam.id}`
        if(!recorders[camId] || !recorders[camId].isRecording()) {
            const device = new onvif.OnvifDevice(cam)
            return device.init()
                .then(() => {

                    const url = device.getUdpStreamUrl();
                    const date = format(new Date(), "yyyy.MM.dd")
                    const hour = format(new Date(), "HH.ii.ss")
                    const clientName = "@" + client.id_qrcode
                    const filePattern = `${cam.id}/${date}/${hour}-${clientName}`
                    recorders[camId] = new Recorder(url, __dirname + "/../../public/media/no_watermark/", {
                        title: `Camera ${cam} - ${filePattern}`,
                        filePattern,
                        segmentTime: 0,
                    }).on(RecorderEvents.STOP, (param) => {
                        console.log(`STOP CAM ${camId}`, param)
                    }).on(RecorderEvents.START, (param) => {
                        console.log(`START CAM ${camId}`, param)
                    }).on(RecorderEvents.ERROR, (param) => {
                        console.log(`ERROR CAM ${camId}`, param)
                    }).start()
                    recorders[camId].recordFilePath = filePattern;

                    return {
                        status: 200,
                        message: `Started recording camera ${cam}`,
                        err: "",
                    }

                })
                .catch(err => {
                    console.log(err);
                    return {
                        status: 500,
                        message: "Error starting recording",
                        err: err,
                    }
                })
        } else {
            console.log(`Camera ${cam.id} is already recording`);
            return {
                status: 200,
                message: `Camera ${cam.id} is already recording`,
                err: ''
            }
        }
    },

    async stop(cam, client, proceed) {
        console.log("[ INFO ] - (stop) - stopping....")
        console.log(cam);
        let response = true;
        const camId = `cam${cam.id}`
        let path = "";
        if(recorders[camId] && recorders[camId].isRecording()) {
            path = recorders[camId].recordFilePath
            recorders.proceed = {
                [camId]: proceed
            }
            recorders[camId].stop();
            console.log(` [ info ] - (stop) - Recording for camera ${cam.id} stopped`);

            response = true
        } else {
            console.log(` [ info ] - (stop) - camera ${cam.id} is not recording`);

            response = false
        }


        return {
            response,
            proceed,
            client,
            path,
        }
    }
}

