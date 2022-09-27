const router = require("express").Router();
const client = require("../db");

// real-time
router.post("/create-aircaft",async (req, res) => {
    try {
        const {aircaft_name, 
            aircaft_typeid,
            team_id,
            activation_time,
            serial_number,
            flight_controllerid,
            package,
            aircaft_lock}= req.body;
        //1.check aircaft name and serial number
        const check_Aircaft = await client.query("SELECT * FROM aircaft WHERE aircaft_name=$1", [aircaft_name]);
        const check_serialNumer = await client.query("SELECT * FROM aircaft WHERE serial_number=$1", [serial_number]);
        if(check_Aircaft.rows.length){
            return res.send("Aircaft already axits");
        }
        if(check_serialNumer.rows.length){
            return res.send("Serial number already exits");
        }
        //2.create aircaft
        await client.query("INSERT INTO aircaft(aircaft_name,aircaft_typeid,team_id,activation_time,serial_number,flight_controllerid,package,aircaft_lock)"+"VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
            [aircaft_name,
            aircaft_typeid,
            team_id,
            activation_time,
            serial_number,
            flight_controllerid,
            package,
            aircaft_lock]);
        
        //3. get aircaft id
        const aircaft_id = await client.query(`SELECT aircaft_id from aircaft WHERE aircaft_name ='${aircaft_name}';`);
        const aircaft_ID = aircaft_id.rows[0].aircaft_id;
         //4.create aircaft real time table
        const realtime_Name = "rt_" + aircaft_ID.replaceAll("-", "_");

        await client.query(`CREATE TABLE IF NOT EXISTS ${realtime_Name} (
         realtime_id uuid not null default uuid_generate_v4() primary key,
         aircaft_id uuid not null,
         flightmode_id uuid not null, 
         pilot_id uuid not null,
         method_id uuid not null,
         spraying_rate real[][] not null, 
         route_spacing real not null, 
         flight_speed real[][] not null, 
         height real[][] not null, 
         hopper_outletsize real[][] not null, 
         spinner_diskspeed real[][] not null, 
         location varchar(255) not null, 
         data real[][] not null, 
         area float,
         take_of_time timestamp not null, 
         landing_time timestamp, 
         flight_duaration varchar(255),  
         FOREIGN KEY (flightmode_id) REFERENCES flight_mode(flightmode_id),
         FOREIGN KEY (pilot_id) REFERENCES pilot(pilot_id),
         FOREIGN KEY (aircaft_id) REFERENCES aircaft(aircaft_id),
         FOREIGN KEY (method_id) REFERENCES method_type(method_id));`);
        return res.status(200).send(req.body);
    } catch (err) {
        console.error(err.message)
        res.status(401).send("can not create aircaft");
    }
})
//get information aircaft
router.post("/get-aircaft", async (req, res)=>{
     try{  
        const {aircaft_id} = req.body;
        //1.check id aircaf table
        const check_aircaftID = await client.query("SELECT * FROM aircaft WHERE aircaft_id = $1", [aircaft_id]);
       if(check_aircaftID.rows.length==0){

            return res.send("Aircaft ID does not exist");
        }
        const getAircaft = await client.query("SELECT * FROM aircaft WHERE aircaft_id = $1", [aircaft_id]);
       
        
        return res.status(200).send(getAircaft.rows[0].aircaft_name);
    }
    catch(err){
        console.error(err.message);
        res.status(401).send("Server Fail");
    }
});

//update aircaft
router.post("/update-aircaft", async (req, res)=>{
    try{
        //1.get value from body
        const{aircaft_id, aircaft_name,aircaft_typeid,team_id,status,activation_time,serial_number,flight_controllerid,package,aircaft_lock}= req.body;
        //2.check aircaft id
        try{
            const check_aircaftID = await client.query("SELECT * FROM aircaft WHERE aircaft_id = $1", [aircaft_id]);
            if(check_aircaftID.rows.length==0){
                return res.status(401).send("aircaft id does not exits");
            }
        }
        catch(err){
            res.status(401).send("error aircaft id");
        }
        //3.check aircaft name
        try{
            const check_aircaftName  =await client.query("SELECT * FROM aircaft WHERE aircaft_name = $1", [aircaft_name]);
            if(check_aircaftName.rows.length==1){
                return res.status(401).send("aircaft name already exits");
            }
        }
        catch(err){
            return res.status(401).send("error aircaft name");
        }
        //4.check aircaft type in aircaft type table
       
        try{
            const check_aircaftType = await client.query("SELECT * FROM aircaft_type WHERE aircaft_typeid=$1", [aircaft_typeid]);
            if(check_aircaftType.rows.length==0){
                return res.status(401).send("aircaft type id does not exits");
            }
        }
        catch(err){
            return res.status(401).send("aircaft type error");
        }
        // 5.check team id in team table
        try {
            const check_teamID = await client.query("SELECT * FROM team WHERE team_id=$1", [team_id]);
            if(check_teamID.rows.length==0){
                return res.status(401).send("team does not exist");
            }
        } catch (err) {
            return res.status(401).send("team id error");
        }
        await client.query("UPDATE aircaft SET aircaft_name = $1,aircaft_typeid=$2,team_id=$3,status=$4,activation_time=$5,serial_number=$6,flight_controllerid=$7,package=$8,aircaft_lock=$9 WHERE aircaft_id = $10",
            [aircaft_name,
            aircaft_typeid,
            team_id,
            status,
            activation_time,
            serial_number,
            flight_controllerid,
            package,aircaft_lock,
            aircaft_id]);
        return res.status(200).send("update aircaft succes");

    }
    catch(err){
        console.error(err.message);
        res.status(401).send("Server Fail");
    }
});

//delete aircaft
router.post("/delete-aircaft", async (req, res)=>{
    try {
        const {aircaft_id}  = req.body;
        //1.check aircaft ID
        const check_aircaftID = await client.query("SELECT * FROM aircaft WHERE aircaft_id=$1", [aircaft_id]);
        console.log(check_aircaftID.rows)
        try {
            if(check_aircaftID.rows.length==0){
                return res.send("Aircaft id does not exits");
            }
        } catch (err) {
            return res.status(401).send("aircaftb id error");
        }
        
        //2.delete table realtime
        const realtime_Name = "rt_" + check_aircaftID.rows[0].aircaft_id.replaceAll("-","_");
        await client.query(`DROP TABLE ${realtime_Name};`);
        console.log(`DELETE FROM aircaft WHERE aircaft_id= '${aircaft_id}';`)
        await client.query(`DELETE FROM aircaft WHERE aircaft_id= '${aircaft_id}';`);
       
        return res.status(200).send("Delete success");
        
    } catch (arr) {
        return res.status(401).send("Server fail");
    }
   
});

module.exports = router;