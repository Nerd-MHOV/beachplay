export default {
    key: "Example",
    options: {
        delay: 10000, // 10s
    },
    async handle({ data }) {
        //action job // ***
        console.log(data);
    }
}