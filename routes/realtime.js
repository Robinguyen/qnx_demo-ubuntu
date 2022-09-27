const router = require("express").Router();
const client = require("../db");
const { json } = require("express");
const replaceAll = require("replaceall");
// real-time
router.post("/upload-data",async (req, res) => {
    try{
        var aircaft_nameStatus=false;
        //1.get value form body
        const {aircaft_id,
            realtime_id,
            aircaft_name,
            flightmode_id, 
            pilot_id,
            method_id,
            spraying_rate,
            route_spacing, 
            flight_speed, 
            height, 
            hopper_outletsize,
            spinner_diskspeed, 
            location, 
            data, 
            area,
            take_of_time, 
            landing_time, 
            }  = req.body;
        if(realtime_id == 'null'){
            //2.get aircaft id from aicaft name
            const get_aircaftID  = await client.query(`SELECT aircaft_id FROM aircaft WHERE aircaft_name = '${aircaft_name}';`);
            const aircaftID = get_aircaftID.rows[0].aircaft_id;
            const realtime_aircaftName  = "rt_" + replaceAll("-", "_", aircaftID);
            //3. check name table exists?
            try {
                const get_allTable = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${realtime_aircaftName}';`);
                    //check table name in database
                if(get_allTable.rows.length==1){
                    aircaft_nameStatus=true;
                }
                else{
                    aircaft_nameStatus=false;
                }
                 
            } catch (error) {
            return res.status(401).send("Aircaft name error");
            }
            //4. insert Data
            try {
                if(aircaft_nameStatus==true){
                    //4.1. insert first
                    //check data in realtime 
                    const select_table  = await client.query(`SELECT aircaft_id FROM ${realtime_aircaftName}`);    
                    if(select_table.rows.length==0){
                        await client.query(`INSERT INTO ${realtime_aircaftName}(aircaft_id,flightmode_id, 
                                        pilot_id, method_id,spraying_rate, route_spacing, flight_speed, 
                                        height, hopper_outletsize, spinner_diskspeed, location, 
                                        data, take_of_time, area, landing_time, flight_duaration) VALUES 
                                        ('${aircaftID}',
                                        '${flightmode_id}',
                                        '${pilot_id}',
                                        '${method_id}',
                                        '{${spraying_rate}}',
                                        '${route_spacing}',
                                        '{${flight_speed}}',
                                        '{${height}}',
                                        '{${hopper_outletsize}}',
                                        '{${spinner_diskspeed}}',
                                        '${location}',
                                        '{${data}}',
                                        '${take_of_time}',
                                        null,
                                        null,null);`); 
                        //insert data aicaft with status true
                        await client.query(`UPDATE aircaft SET status = true WHERE aircaft_name = '${aircaft_name}';`);
                        //response realtime id
                        const get_realtimeID = await client.query(`SELECT realtime_id FROM ${realtime_aircaftName} WHERE landing_time is null;`);
                        
                        //const get_realtimID = await client.query(`SELECT realtime_id FROM ${realtime_aircaftName} WHERE take_of_time = ${take_of_time};`);
                        const get_aircaftID = await client.query(`SELECT aircaft_id FROM aircaft WHERE aircaft_name = '${aircaft_name}';`);
                        
                        return res.status(200).json({
                            "realtime_id": `${get_realtimeID.rows[0].realtime_id}`,
                            "aircaft_id":  `${get_aircaftID.rows[0].aircaft_id}`
                        });
                    }
                    //4.2. insert ! insert first
                    //check take time exists?
                    let status_landingTime=false;
                    //check landing time complete
                    const check_landingTime = await client.query(`SELECT landing_time FROM ${realtime_aircaftName};`);
                    for(const value in check_landingTime.rows){
                        if(check_landingTime.rows[value].landing_time==null){
                            status_landingTime=false;
                            break;
                        }
                        else{
                            status_landingTime=true;
                        }
                    }
                    if(select_table.rows.length!=0 && status_landingTime==true)
                    {
                        //insert new data realtime table
                        await client.query(`INSERT INTO ${realtime_aircaftName}(aircaft_id,flightmode_id, pilot_id, method_id, spraying_rate, route_spacing, 
                                    flight_speed, height, hopper_outletsize, spinner_diskspeed, location, 
                                    data, take_of_time, area, landing_time, flight_duaration) 
                                    VALUES ('${aircaftID}',
                                            '${flightmode_id}',
                                            '${pilot_id}',
                                            '${method_id}',
                                            '{${spraying_rate}}',
                                            '${route_spacing}',
                                            '{${flight_speed}}',
                                            '{${height}}',
                                            '{${hopper_outletsize}}',
                                            '{${spinner_diskspeed}}',
                                            '${location}',
                                            '{${data}}',
                                            '${take_of_time}',
                                            null,
                                            null,null);`); 
                        //insert data aicaft with status true
                        await client.query(`UPDATE aircaft SET status = 'true' WHERE aircaft_name = '${aircaft_name}';`);
                        //response realtime id  
                        //get realtime aircaft id
                        const get_realtimID = await client.query(`SELECT realtime_id FROM ${realtime_aircaftName} WHERE landing_time is null;`);
                        const get_aircaftID = await client.query(`SELECT aircaft_id FROM aircaft WHERE aircaft_name = '${aircaft_name}';`);
                        return res.status(200).json({
                            "realtime_id": `${get_realtimID.rows[0].realtime_id}`,
                            "aircaft_id":  `${get_aircaftID.rows[0].aircaft_id}`
                        });
                    }
                    else{
                        return res.status(401).send("Error insert !first")
                    }
                }
            }catch(error){
                return res.status(401).send("Error insert");
            }
        }
        //realtime id !=null
        else
        {
            //upload data
            const realtime_aircaftName  = "rt_" + replaceAll("-", "_", aircaft_id);
            const select_table  = await client.query(`SELECT * FROM ${realtime_aircaftName}`);    
            if(select_table.rows.length!= 0)
            {
                try {
                        //check landing time
                        const check_landTime = await client.query(`SELECT landing_time FROM ${realtime_aircaftName} WHERE realtime_id = '${realtime_id}';`);
                        if(check_landTime.rows[0].landing_time==null)
                        {
                            //upload data
                            await client.query(`UPDATE ${realtime_aircaftName} SET spraying_rate = spraying_rate || '{${spraying_rate}}', 
                                                                     flight_speed = flight_speed || '{${flight_speed}}', 
                                                                     height = height || '{${height}}', 
                                                                     hopper_outletsize = hopper_outletsize || '{${hopper_outletsize}}', 
                                                                     spinner_diskspeed = spinner_diskspeed || '{${spinner_diskspeed}}', 
                                                                     data = data || '{${data}}' 
                                                                     WHERE realtime_id = '${realtime_id}';`);
                            
                            //check landing tim
                            if(landing_time!='null' && area !=null){
                                //insert landing time
                                await client.query(`UPDATE ${realtime_aircaftName} SET landing_time = '${landing_time}', area = '${area}' WHERE realtime_id = '${realtime_id}';`);
                                //calula time
                                const get_takeTime = await client.query(`SELECT take_of_time FROM ${realtime_aircaftName} WHERE realtime_id = '${realtime_id}';`);
                                const get_landingTime = await client.query(`SELECT landing_time FROM ${realtime_aircaftName} WHERE realtime_id = '${realtime_id}';`);
                                const time = await client.query(`SELECT(DATE_PART('hour', '${new Date(get_landingTime.rows[0].landing_time).toISOString()}'::timestamp - '${new Date(get_takeTime.rows[0].take_of_time).toISOString()}'::timestamp)) * 60 + 
                                      DATE_PART('minute', '${new Date(get_landingTime.rows[0].landing_time).toISOString()}'::timestamp - '${new Date(get_takeTime.rows[0].take_of_time).toISOString()}'::timestamp) * 60 + 
                                      DATE_PART('second', '${new Date(get_landingTime.rows[0].landing_time).toISOString()}'::timestamp - '${new Date(get_takeTime.rows[0].take_of_time).toISOString()}'::timestamp) as time;`);                                      
                                
                                      //convert data                           
                                const hours = Math.floor(time.rows[0].time / 3600);
                                const minute = Math.floor(time.rows[0].time %3600/60);
                                const second = Math.floor(time.rows[0].time % 3600 % 60);
                                const setTime  = hours +":"+ minute +":" +second;
                                //update flight duaration time
                                await client.query(`UPDATE ${realtime_aircaftName} SET flight_duaration = '${setTime}' WHERE realtime_id = '${realtime_id}';`);
                                //update status aicaft
                                await client.query(`UPDATE aircaft SET status = false WHERE aircaft_id = '${aircaft_id}';`);

                                console.log()
                                aircaft_nameStatus=false;
                                return res.status(200).send("complete data");     
                            }
                            return res.status(200).send("Insert data");    
                        }
                        else
                        {
                            return res.status(401).send("Error insert data");
                        }  
                }catch(error){
                    return res.status(401).send("Error insert");
                } 
            }
        }
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
//read data from server
router.post("/get-data", async (req, res) =>{
    try {
        //1. get data in req
        const {aircaft_id} = req.body;
        //2.create realtime name table
        const realtime_name = "rt_" + replaceAll("-", "_", aircaft_id);
        console.log(realtime_name)
       try 
       {
           const data =  await client.query(`SELECT aircaft_name, aircaft_typeid, username as pilot_name, spraying_rate[array_length(spraying_rate, 1)],
                                        route_spacing, flight_speed[array_length(flight_speed, 1)], height[array_length(height, 1)], 
                                        hopper_outletsize[array_length(hopper_outletsize, 1)], spinner_diskspeed[array_length(spinner_diskspeed, 1)] 
                                        FROM ((aircaft NATURAL JOIN pilot) NATURAL JOIN ${realtime_name}) WHERE landing_time is null;`);
            console.log(data.rows)
            return res.status(200).json({
                "aircaft_name": `${data.rows[0].aircaft_name}`,
                "aircaft_typeid": `${data.rows[0].aircaft_typeid}`,
                "pilot_name": `${data.rows[0].pilot_name}`,
                "spraying_rate": `${data.rows[0].spraying_rate}`,
                "route_spacing": `${data.rows[0].route_spacing}`,
                "task_flight_speed": `${data.rows[0].flight_speed}`,
                "height": `${data.rows[0].height}`,
                "hopper_outlet_size": `${data.rows[0].hopper_outletsize}`,
                "spinner_disk_speed": `${data.rows[0].spinner_diskspeed}`

            });
       } catch (error) {
        return res.status(400).send("Server Error");
       }
  
    } catch (error) {
        console.error(error.message);
       return res.status(401).send("Server fail");
    }
  
    
});

router.post("/get-actionaircaft", async (req, res)=>{
    try {
        const {status} = req.body;
        
        if(status==1){
            try {
                const action_aircaft = await client.query("SELECT status FROM aircaft");
                let action_value=0;
                for(const value in action_aircaft.rows){
                    if(action_aircaft.rows[value].status==1){
                       action_value+=1;
                    }
                }
                //get name action aircaft name
                const get_actionAircaft = await client.query("SELECT aircaft_name FROM aircaft WHERE status='true';");
                const json = JSON.stringify(get_actionAircaft.rows)
                return res.status(200).json({
                    "action_aircaft": `${action_value}`,
                    "action_aircaftName": `${json}`
                })
               
            } catch (error) {
                return res.status(401).send("Aircaft Error");
            }
        }
        
    } catch (error) {
        return res.status(401).send("Server Error");
    }
   
    
});

router.post("/get-alldata", async (req, res)=>{
    var data=[];
    try 
    {
        const {aircaft_id} = req.body;
        //1.check aircaft id
        const check_Aicaftid = await client.query(`SELECT aircaft_id FROM aircaft WHERE aircaft_id = '${aircaft_id}';`);
        if(check_Aicaftid.rows.length==0){
            return res.status(401).send("Aircaft ID does not exists");
        }

        //2.convert aircaft id -> realtime name;
        const realtime_Name = "rt_" + replaceAll("-", "_",  aircaft_id);
        //3. get all realtime ID
        const get_realtimeID = await client.query(`SELECT realtime_id FROM ${realtime_Name};`);
        //4. check landing time of realtime id
        for(const value of get_realtimeID.rows){
            try {
                const check_landingTime =  await client.query(`SELECT landing_time FROM ${realtime_Name} WHERE realtime_id = '${value.realtime_id}';`);
                if(check_landingTime.rows[0].landing_time!=null){
                    const get_Alldata = await client.query(`SELECT * FROM ${realtime_Name} WHERE realtime_id = '${value.realtime_id}';`);
                    data.push(get_Alldata.rows);   
                     
                }

            } catch (error) {
                return res.status(401).send("Error");
            }
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(401).send("Server Error");
    }
})

router.post("/delete-data", async (req, res)=>{
    try {
        const {aircaft_id, realtime_id} = req.body;
        const realtime_name = "rt_"  + replaceAll("-", "_",  aircaft_id);
        //1. check realtime table name exists??
        const get_allTable = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        for(const i in get_allTable.rows){
            const name_table = get_allTable.rows[i].table_name;
            //check table name in database
            if(name_table == realtime_name){
                try {
                    await client.query(`DELETE FROM ${realtime_name} WHERE realtime_id = '${realtime_id}';`);
                    return res.status(200).send("Delete success");
                    
                } catch (error) {
                    console.error(error);
                    return res.status(401).send("Delete Error");
                }
                break;
            }
        } 

        
    } catch (error) {
        console.error(error);
        return res.status(401).send("Server Error")
    }

});
module.exports = router;