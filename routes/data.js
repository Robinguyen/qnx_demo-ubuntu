const router = require('express').Router();
const client = require('../db');

router.post("/data", async (req, res)=>{
    try {
        const data  =  await client.query("SELECT aircaft_name FROM aircaft;");
        return res.status(200).send(data);
    } catch (error) {
        return res.status(401).send(error);
    }
})

module.exports = router;