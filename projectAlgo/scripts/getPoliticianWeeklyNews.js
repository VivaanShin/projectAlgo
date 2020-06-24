const PythonShell=require('python-shell').PythonShell;
const pathUtil=require('path');
module.exports=function getPoliticianWeeklyNews(politician_name,weekStartDay,weekEndDay){ //connection 하나를 전달 받아서 사용,동기형으로 tn_user_politician_grade를 모두 가져옴
    return new Promise((resolve,reject)=>{
        weekStartDay=weekStartDay.replace('-','.');
        weekEndDay=weekEndDay.replace('-','.');
        var option={
            mode:'json',
            pythonPath:'',
            pythonOptions: ['-u'],
            scriptPath: '',
            encoding:'utf-8',
            args:[politician_name,weekStartDay,weekEndDay]
        };
        PythonShell.run(pathUtil.resolve(__dirname,'./get_news_by_week.py'),option,(err,results)=>{
            if(err){
                reject(err);
            }

            console.log(results[0]);
            resolve(results[0]);
        });
    });
};