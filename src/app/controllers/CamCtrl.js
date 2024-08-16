import {getCam, getClient} from "../lib/PrismaClient";
import Queue from "../lib/Queue";
import {recorders} from "../lib/Recorders";

export default {
    async record( req,res ) {
        const { cam, id } = req.params;

        const client = await getClient(id);
        console.log("[CamCtrl.js-record", client)
        if(!client) return res.status(404).send("Client not found")

        const camDB = await getCam(cam);
        if(!camDB) return res.status(404).send("Cam not found")

        await Queue.add("StartRecord", {
            cam: camDB, client
        })

        return res.send("Starting recording")
    },

    async stop( req,res ) {
        const { cam } = req.params;
        const { proceed, id } = req.query;

        const client = await getClient(id);
        console.log("CamCtrl.js-stop", client)

        const camDB = await getCam(cam);
        if(!camDB) return res.status(404).send("Cam not found")

        await Queue.add("StopRecord", {
            cam: camDB, client, proceed
        })

        return res.send("Stopping recording");
    }
}