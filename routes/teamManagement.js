const router = require("express").Router();
const client = require("../db");
const replaceAll = require("replaceall");
//function total realtime
router.post("/get-data", async (req, res) =>{
        return res.status(200).send("ok");
        /*const data  = ["team.name","aircaft.aircaft_name","flight_mode.flightmode_name","location","method_type.method_name", "pilot.username", "area"];
        var get_nameTable=[]; //variable get all table name
        var val_query=""; // variable using select
        var data_check = []; // variable push data from req.body
        var dataType = []; // variable using push all data !null 
        var method_name="null"; // variable check spraying and spreading
        var union_sumArea="SELECT SUM(area)::float as area, TO_CHAR(t.take_of_time :: DATE, 'yyyy/mm/dd') as time FROM ( "; 
        var union_area="";
        var union_data="";// query string
        var union_search = `SELECT SUM(area) as area, TO_CHAR(t.time :: DATE, 'yyyy/mm/dd') as time FROM ( `
        const {start_date, end_date, 
                team_name, aircaft_name, 
                mode, location, spraying,
                spreading, account, area}= req.body;
                
        //1. get all name table
        if(team_name!='null'){
           
            //const get_aircaft = await client.query(`SELECT aircaft_id FROM (aircaft NATURAL JOIN team) WHERE team.name = '${team_name}';`)
           
            for(const value of get_aircaft.rows){
                get_nameTable.push("rt_" + replaceAll('-', '_', value.aircaft_id));
            }
          
            // value check request 
            if(start_date=='null' && end_date=='null' && aircaft_name =='null' && mode =='null' && 
            location =='null' && spraying=='false' && spreading=='false' && account=='null' && area=='null'){
                try {
                    for(const value in get_nameTable){
                        if(value == get_nameTable.length-1){
                            union_data += `SELECT DISTINCT TO_CHAR(take_of_time :: DATE, 'yyyy/mm/dd') as time from ${get_nameTable[value]} WHERE ((SELECT to_char(CURRENT_TIMESTAMP, 'YYYY-MM'))  = (SELECT to_char(take_of_time, 'YYYY-MM'))) AND landing_time is not null ORDER BY time DESC;`
                            break;
                        }
                        union_data  += `SELECT DISTINCT TO_CHAR(take_of_time :: DATE, 'yyyy/mm/dd') as time from ${get_nameTable[value]} WHERE ((SELECT to_char(CURRENT_TIMESTAMP, 'YYYY-MM'))  = (SELECT to_char(take_of_time, 'YYYY-MM'))) AND landing_time is not null UNION `;
                    } 
                    const get_timeSearch  = await client.query(union_data);
                    for(const values in get_timeSearch.rows){
                        for(const value in get_nameTable){
                            if(value == get_nameTable.length-1 && values == get_timeSearch.rows.length-1){
                                union_area += `SELECT take_of_time::date, coalesce((area::numeric)) as area FROM ((${get_nameTable[value]} NATURAL JOIN aircaft) JOIN team USING (team_id)) WHERE team.name = '${team_name}' AND take_of_time::date = '${get_timeSearch.rows[values].time}' AND landing_time is not null) as t GROUP BY t.take_of_time;`
                                break;
                            }
                            union_area  += `SELECT take_of_time::date, coalesce((area::numeric)) as area  FROM((${get_nameTable[value]} NATURAL JOIN aircaft) JOIN team USING (team_id)) WHERE team.name = '${team_name}' AND take_of_time::date = '${get_timeSearch.rows[values].time}' AND landing_time is not null UNION ALL `; 
                        }
                    }
                    const get_data = await client.query(union_sumArea + union_area);
                
                    return res.send(union_area);   
                } catch (error) {
                    console.error(error);
                    return res.status(401).send("Error server");
                }
            }
            else
            {  
                 //1.2. check sparing and spreading value;
                 if(spreading=='true' && spraying=='true' || spreading=='false' && spraying=='false'){
                    method_name="null";
                }
                else{
                    switch (spraying) {
                        case 'true':
                            method_name="spraying"
                            break;
                        }
                       switch (spreading) {
                        case 'true':
                            method_name="spreading"
                            break;
                    }
                }
                //1.3. check start date
                if(start_date!='null' && end_date!='null'){
                    dataType.push("take_of_time::date >= " + `'${start_date}'` + " AND take_of_time::date <= " + `'${end_date}'`);
                }
                else{
                    dataType.push("((SELECT to_char(CURRENT_TIMESTAMP, 'YYYY-MM'))  = (SELECT to_char(take_of_time, 'YYYY-MM')))")
                }
                 //1.4.check data from request
                data_check.push(team_name, aircaft_name, mode, location, method_name, account, area);
                for(let value in data_check){
                    if(data_check[value]!='null'){
                        dataType.push(data[value] + "=" + `'${data_check[value]}'`);
                    }   
                }
                //1.5. check value select
                if(dataType.length==1){
                    val_query += dataType[0];
                }
                else{
                    for(let val in dataType){
                        if(val == dataType.length-1){
                            val_query += dataType[val] +" "
                            break;
                        }  
                        val_query += dataType[val] +" AND ";
                    }
                }
                //1.6. get data search
                try {
                     //1.6.1. get date data search
                    for(const value in get_nameTable){
                        if(value == get_nameTable.length-1){
                            union_search  += `SELECT SUM(coalesce((area::numeric))) as area, take_of_time::date as time FROM(((${get_nameTable[value]} NATURAL JOIN method_type) NATURAL JOIN  flight_mode) NATURAL JOIN aircaft) JOIN 
                            (pilot NATURAL JOIN team) USING (pilot_id) WHERE ${val_query} AND landing_time is not null GROUP BY time ) as t GROUP BY t.time ORDER BY t.time DESC;`;
                            break;
                        }
                        union_search  += `SELECT SUM(coalesce((area::numeric))) as area, take_of_time::date as time FROM(((${get_nameTable[value]} NATURAL JOIN method_type) NATURAL JOIN  flight_mode) NATURAL JOIN aircaft) JOIN 
                        (pilot NATURAL JOIN team) USING (pilot_id) WHERE ${val_query} AND landing_time is not null GROUP BY time  UNION ALL `;
                    } 
                    const get_realtime = await client.query(union_search);
                    return res.send(get_realtime.rows); 
                } catch (error) {
                    console.error(error);
                    return res.status(401).send("Error search")
                }   
            }
        }*/
 
})
//total area pilot of team
router.post("/member-rankings", async(req, res)=>{
    try {
        var realtime_name=[];
        var rq_value=[{}]
        var union_value = "SELECT SUM(area) as area, t.username FROM("

        const {team_name, start_date, end_date, date} = req.body;
        //1. get aircaft id from team
        const get_aircaftID =await client.query(`SELECT aircaft_id FROM (team NATURAL JOIN aircaft) WHERE team.name = '${team_name}';`)
        //2. get realtime table with aircaft ID
        for(const value of get_aircaftID.rows){
            const rt_name = "rt_" + replaceAll('-', '_', value.aircaft_id);
            const check_realtime = await client.query(`SELECT realtime_id FROM ${rt_name} WHERE landing_time is not null LIMIT 1;`);
            if(check_realtime.rows.length!=0){
                realtime_name.push(rt_name);
            }
        }
        //do not time select
        if(start_date=='null' && end_date =='null' && date=='null'){
            //get data
            try{
                for(const values in realtime_name){
                    if(values == realtime_name.length-1){
                        union_value += `SELECT SUM(area) as area, pilot.username FROM (${realtime_name[values]} NATURAL JOIN pilot)   
                        NATURAL JOIN team GROUP BY pilot.username, team.name) as t GROUP BY t.username ORDER BY area DESC;`
                         break;
                    }
                    union_value += `SELECT SUM(area) as area, pilot.username FROM (${realtime_name[values]} NATURAL JOIN pilot)   
                    NATURAL JOIN team GROUP BY pilot.username, team.name UNION `
                } 
                const get_totalArea = await client.query(union_value)
                for(var val of get_totalArea.rows){
                    rq_value.push({pilo: val.username , suma: Math.round((val.area)*100)/100}); 
                }
                rq_value.shift();//remove first element*/
                
                return res.status(200).send(rq_value) 
            }catch(error){
                console.error(error);
                return res.status(401).send("Error");
            }
        }   
        else{
            if(date!='null' && start_date=='null'& end_date=='null'){
                try{
                    for(const values in realtime_name){
                         if(values == realtime_name.length-1){
                            union_value += `SELECT SUM(t.total) as area,t.username FROM (SELECT SUM(area) as total, pilot.username, take_of_time FROM 
                                (${realtime_name[values]} NATURAL JOIN pilot) NATURAL JOIN team WHERE take_of_time<= CURRENT_TIMESTAMP AND 
                                take_of_time >= NOW() - INTERVAL '${date} DAY' GROUP BY area, pilot.username, team.name, take_of_time) as t GROUP BY t.username ) as t GROUP BY t.username ORDER BY area DESC;`
                                break;
                        }
                        union_value += `SELECT SUM(t.total) as area,t.username FROM (SELECT SUM(area) as total, pilot.username, take_of_time FROM 
                        (${realtime_name[values]} NATURAL JOIN pilot) NATURAL JOIN team WHERE take_of_time<= CURRENT_TIMESTAMP AND 
                        take_of_time >= NOW() - INTERVAL '${date} DAY' GROUP BY area, pilot.username, team.name, take_of_time) as t GROUP BY t.username UNION `
                    }
                    const get_totalArea =  await client.query(union_value);
                    for(var val of get_totalArea.rows){
                        rq_value.push({pilo: val.username , suma:  Math.round((val.area)*100)/100}); 
                    }
                    rq_value.shift();//remove first element
                    return res.status(200).send(rq_value) 
                }catch(error){
                    console.error(error);
                    return res.status(401).send("Error");
                }
            }
            if(start_date!='null' && end_date!='null' && date=='null'){
                try
                {
                    for(const values in realtime_name){
                        if(values == realtime_name.length-1){
                            union_value +=`SELECT SUM(t.total) as area, t.username from (SELECT SUM(area) as total, pilot.username, take_of_time FROM (${realtime_name[values]} NATURAL JOIN pilot) 
                            NATURAL JOIN team WHERE take_of_time::date<='${end_date}' AND take_of_time::date>='${start_date}' GROUP BY area, pilot.username, team.name, take_of_time 
                            ORDER BY take_of_time DESC) as t GROUP BY t.username) as t GROUP BY t.username ORDER BY area DESC;` ;
                            break;
                        }
                        union_value +=`SELECT SUM(t.total) as area, t.username FROM (SELECT SUM(area) as total, pilot.username, take_of_time FROM (${realtime_name[values]} NATURAL JOIN pilot) 
                        NATURAL JOIN team WHERE take_of_time::date<='${end_date}' AND take_of_time::date>='${start_date}' GROUP BY area, pilot.username, team.name, take_of_time 
                        ORDER BY take_of_time DESC) as t GROUP BY t.username UNION `; 
                    }
                    console.log(union_value)
                    const get_totalArea =  await client.query(union_value);
                    for(var val of get_totalArea.rows){
                        rq_value.push({pilo: val.username , suma:  Math.round((val.area)*100)/100}); 
                    }
                    rq_value.shift();//remove first element
                    return res.status(200).send(rq_value) 
                }catch(error){
                    console.error(error);
                    return res.status(401).send("Error");
                }
            }
        } 
    } catch (error) {
        console.error(error);
        return req.status(401).send("Server error");
    }
})

router.post("/data", async (req, res)=>{
    return res.status(200).send("OK");
})
module.exports = router;