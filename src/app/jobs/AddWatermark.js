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
        await FileCam.addWaterMark(path, isProceed)
    }
}