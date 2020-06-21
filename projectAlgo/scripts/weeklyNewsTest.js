const getPoliticianWeeklyNews=require('./getPoliticianWeeklyNews');


async function test(){
    try{
        var results=await getPoliticianWeeklyNews('이낙연','2020-06-14','2020-06-20');
        results=JSON.parse(JSON.stringify(results));

        console.log(results[0].articleTitle);
    }
    catch(err){
        console.log(err);
    }
}

test();