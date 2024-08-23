import { format } from 'date-fns';
import Queue from '../lib/Queue';

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');


export default {
    saveReplay(req, res) {
        const { camID, clientID } = req.params;

        const logFile = path.join(__dirname, '../../cams/', `cam${camID}`, 'changes.log');

        const date = format(new Date(), "yyyy.MM.dd")
        const hour = format(new Date(), "HH.ii.ss")
        const clientName = "@" + clientID
        const filePattern = `${camID}/${date}/${hour}-${clientName}`
        const outputFile = path.join(__dirname, '../../public/media/no_watermark', `${filePattern}.mp4`);
        Queue.add(`GetReplay`, {
            logFile,
            outputFile
        })

        return res.send("Getting your replay...");
    }
}