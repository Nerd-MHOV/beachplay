import camOnvif from "../lib/CamOnvif"
export default {
    key: "StartRecord",
    options: {
        attempts: 3,
    },
    async handle({ data }) {
        const {
            cam,
            client
        } = data;
        const response = await camOnvif.startRecord(cam, client)
        if(response.status === 500) {
            throw new Error(` [ ERROR QUEUES ] - (StartRecord) - FAILED TO START!`)
        }
    }
}