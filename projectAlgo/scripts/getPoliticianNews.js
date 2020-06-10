const fs=require('fs');
const request=require('request');
exports.getPoliticianNewsJSON=async function getPoliticianNewsJSON(politician_name){
    getSyncRequestData=function getSyncRequestData(options){ //동기형으로 API요청
        return new Promise((resolve,reject)=>{
            request(options,(err,res,body)=>{
                if(err) reject(error);
                    
                if (res.statusCode != 200) {
                    reject('상태코드 오류:' + res.statusCode); //200이 아닌 다른코드가 왔을 시는 오류
                }
                console.log(body);
                resolve(body);
            })
        });
    };
    var result={}
    var options={ 
        headers : {
            "X-Naver-Client-Id" : fs.readFileSync('./script/newsClientId.txt'), //클라이언트 ID 
            "X-Naver-Client-Secret" : fs.readFileSync('./script/newsClientSecret.txt') //클라이언트 Secret 
        },
        encoding: "utf-8",
        method : 'get',
        url : 'https://openapi.naver.com/v1/search/news.json',
        qs : {
                query : politician_name, //검색할 정치인 이름
                sort : "date" //날짜 순으로 정렬
        }
    };
    try{
        var body=await getSyncRequestData(options); //반환 받은 값을 JSON으로 변환
        result=JSON.parse(body).items; //items 반환(기사 리스트)
        console.log(result);
    }
    catch(err){
        console.log('ERROR:'+err);
    }
    finally{
            return result;
    }
};
