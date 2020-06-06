# -*- coding: utf-8 -*-
"""
Created on Mon May  4 09:12:18 2020

@author: User
"""

import sys
import pymysql
import urllib.request
import urllib.parse
import get_politician_image #이미지를 저장하는 모듈
from bs4 import BeautifulSoup
from urllib.error import URLError,HTTPError


class PoliticianInformation: # open api에서 정치인 신상정보를 가져오는 클래스
    OPEN_API_URL='http://apis.data.go.kr/9760000/WinnerInfoInqireService2/getWinnerInfoInqire?serviceKey='
    SERVICE_KEY=''
    INSERT_POLITICIAN_DATA="""insert into tb_politician_info (politician_no,politician_name,sgId,sgTypecode,
               sggName,sdName,wiwName,jdName,gender,birtyday,age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,
               prmsCnt,prmsRate)
               select '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', 
               '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', from dual
               where not exists
               (
                   select * from tb_politician_info
                   where politician_no= %s
               )"""
    def __init__(self):
        with open('politicianKey.txt','r') as key_file, open('dbPasswd.txt') as db_passwd_file:
            self.SERVICE_KEY=key_file.read() #SERVICE_KEY 초기화
            db_password=db_passwd_file.read()
        with open('sgId.txt') as sdId_file, open('sgTypecode.txt') as sd_code_file:
            self.sgId=sdId_file.read()
            self.sgType=sd_code_file.read()
        self.url=self.OPEN_API_URL+self.SERVICE_KEY
        print(self.url)
        try:
            self.conn=pymysql.connect(host='localhost',user='root',password=db_password
                                      ,db='project_algo',charset='utf8') #후에 db상황에 맞게 수정
           
        except pymysql.err.OperationalError: #db connection 실패
            print('DB connection 실패')
            sys.exit(-1)
    def get_url(self): #저장 된 코드 정보를 가져옴
        self.get_politician_url=self.url+'&sgId='+urllib.parse.quote_plus(self.sgId)+'&sgTypecode='+urllib.parse.quote_plus(self.sgType)+'&numOfRows=300'
    def get_store_politician_information(self):
        self.get_url()
        try:
           res=urllib.request.urlopen(self.get_politician_url).read().decode()
           soup=BeautifulSoup(res,'html.parser')
           
           with self.conn.cursor() as curs:
                #공약수는 공약을 가져오는 클래스에서 값을 update해주고, 이행도는 이행도 계산 알고리즘 시 변화되므로,
               #default=0
               prmsCnt=0
               prmsRate=0
               for item in soup.findAll('item'):
                   print(item);
               
               #모든 칼럼 값을 가져옴
                   politician_no=int(item.find('huboid').get_text())
                   politician_name=item.find('name').get_text()
                   sgId=item.sgId=item.find('sgId').get_text()
                   sgTypecode=int(item.find('sgTypecode').get_text())
                   sggName=item.find('sggName').get_text()
                   sdName=item.find('sdName').get_text()
                   wiwName=item.find('wiwName').get_text() if item.wiwName else '없음'
                   jdName=item.find('jdName').get_text()
                   gender='M' if item.find('gender').get_text()=='남' else 'F'
                   birthday=item.find('birthday').get_text()
                   age=item.find('age').get_text()
                   addr=item.find('addr').get_text()
                   jobId=int(item.find('jobId').get_text())
                   job=item.find('job').get_text()
                   eduId=int(item.find("eduId").get_text())
                   edu=item.find('edu').get_text()
                   career1=item.find('career1').get_text()
                   career2=item.find('career2').get_text() if item.career2 else '없음'
                   dugsu=int(item.find('dugsu').get_text()) if item.dugsu else 0
                   dugyul=int(item.find('dugyul').get_text()) if item.dugyul else 0
               
              
                   curs.execute(self.INSERT_POLITICIAN_DATA,(politician_no,politician_name,sgId,sgTypecode,sggName,
                                                        sdName,wiwName,jdName,gender,birthday,age,addr,jobId,job,
                                                        eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate,politician_no))
                   print(politician_name+" insert");
               
               #이미지를 크롤링하는 함수를 통해 이미지를 저장
                   get_politician_image.get_politician_image(politician_name, politician_no)
                   print(politician_name+" image saved");
           self.conn.commit()
               
        except HTTPError as e: #HTTP 에러
            print('Error code: ', e.code)
            sys.exit(-1)
        except URLError as e: #URL 에러
            print('URL 실패: ', e.reason)
            sys.exit(-1)
        except Exception as e: #DB 에러
            print('DB 에러: ',e)
            self.conn.rollback()
            sys.exit(-1)
    
    def print_politician_info(self): #정치인 정보 출력 확인용 함수
        self.get_url()
        try:
            res=urllib.request.urlopen(self.get_politician_url).read().decode()
            print(res)
        except Exception as e: #HTTP 에러
            print('출력 실패:',e)
            sys.exit(-1)
    
    def __del__(self):
        self.conn.close()
            

if __name__=='__main__':
    politician_information=PoliticianInformation()
    politician_information.print_politician_info()
    politician_information.get_store_politician_information()
               
    