import camOnvif from "../lib/CamOnvif"
import {recorders} from "../lib/Recorders";
import Queue from "../lib/Queue";
export default {
    key: "StopRecord",
    options: {
        delay: 10000,
        attempts: 3,
    },
    async handle({ data }) {
        const {
            cam,
            client,
            proceed
        } = data;
        const {path, response} = await camOnvif.stop(cam, client, proceed)
        console.log(client);
        if (response) await Queue.add("AddWatermark", {
            path, isProceed: !!proceed
        })
        if(proceed && client){
            setTimeout(async() => {
                await Queue.add("StartRecord", {
                    cam, client
                })

            },5000)
        }
    }
}