# -*- coding: utf-8 -*-
"""
Created on Mon May  4 05:10:15 2020

@author: User
"""

import sys
import pymysql
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
from urllib.error import URLError,HTTPError


class ElectionCodeInformation: #코드 정보 open api에서 코드를 가져오는 클래스
    OPEN_API_URL='http://apis.data.go.kr/9760000/CommonCodeService/getCommonSgCodeList?numOfRows=30&serviceKey='
    SERVICE_KEY=''
    INSERT_SQL="""insert into tb_election_code (code,type,name)
                    SELECT '%s',2,'제21대 국회의원 선거' from dual
                    where not exists
                    (
                        select *
                        from tb_election_code
                        where code=%s
                    )""" #나중에 db컬럼 명에 따라 변경
    def __init__(self):
        try:
            with open('codeKey.txt','r') as key_file, open('dbPasswd.txt') as db_passwd_file:
                self.SERVICE_KEY=key_file.read() #SERVICE_KEY 초기화
                db_password=db_passwd_file.read()
                
            self.url=self.OPEN_API_URL+self.SERVICE_KEY
            print(self.url)
            self.conn=pymysql.connect(host='localhost',user='root',password=db_password
                                      ,db='project_algo',charset='utf8') #후에 db상황에 맞게 수정
        except pymysql.err.OperationalError as e: #db connection 실패
            print('DB connection 실패', e)
            sys.exit(-1)
    
    def get_store_election_code(self): #코드정보를 가져와서 DB에 저장
        try:
            res=urllib.request.urlopen(self.url).read()
            soup=BeautifulSoup(res,'html.parser')
             
            for item in soup.findAll('item'):
                if urllib.parse.quote_plus(item.sgName.string)==urllib.parse.quote_plus('제21대 국회의원 선거'):
                    #후에 직접 데이터 출력 후 선거이름 확인
                    with self.conn.cursor as curs:
                        curs.execute(self.INSERT_SQL,(item.sqId.string,item.sqId.string))
            
            self.conn.commit()
        except HTTPError as e: #HTTP 에러
            print('Error code: ', e.code)
            sys.exit(-1)
        except URLError as e: #URL 에러
            print('URL 실패: ', e.reason)
            sys.exit(-1)
        except Exception as e: #DB 에러
            self.conn.rollback()
            print('DB 에러: ',e)
            sys.exit(-1)
            
    def print_code(self): #xml 확인용 출력함수
        try:
            res=urllib.request.urlopen(self.url).read()
            print(res)
        except Exception as e: #HTTP 에러
            print('출력 실패:',e)
            sys.exit(-1)
            
    def __del__(self):
        self.conn.close()
        

if __name__=='__main__':
    election_code=ElectionCodeInformation()
    election_code.print_code()
    election_code.get_store_election_code()
            
    
    
            