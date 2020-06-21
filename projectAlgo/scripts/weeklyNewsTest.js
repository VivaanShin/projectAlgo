const getPoliticianWeeklyNews=require('./getPoliticianWeeklyNews');


async function test(){
    try{
        var results=await getPoliticianWeeklyNews('태구민','2020-05-24','2020-05-30');
        results=JSON.parse(JSON.stringify(results));

        console.log(results[3]);
    }
    catch(err){
        console.log(err);
    }
}

test();