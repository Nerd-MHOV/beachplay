import FileCam from "../lib/FilesCam"
export default {
    key: "AddWatermark",
    options: {
        delay: 15000,
        attempts:3,
        backoff: {
            type: "exponential",
            delay: 1000,
        }
    },
    async handle({ data }) {
        const {
            path,
            isProceed = true,
        } = data;

        const success = await FileCam.addWaterMark(path, isProceed)
        // if(!success) throw new Error(` [ ERROR QUEUE ] - (AddWatermark) - ERROR TO ADD WATERMARK!`)
    }
}