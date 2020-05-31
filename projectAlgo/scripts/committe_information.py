# -*- coding: utf-8 -*-
"""
Created on Tue May 12 00:04:36 2020
@author: User
"""

import sys
import pymysql
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
from urllib.error import URLError,HTTPError

class CommitteeInformation: #OPEN API에서 소관위 정보를 가져오는 클래스
    OPEN_APL_URL='http://apis.data.go.kr/9710000/BillInfoService2/getCommitPetitionList?&ServiceKey='
    SERVICE_KEY=''
    INSERT_SQL="""insert into tb_committee_info (committeeCode,committeename) 
                  values(%s,%s)
                    """
    #후에 DB 정의되면 맞게 변경
    def __init__(self):
        with open('legislationKey.txt','r') as key_file, open('dbPasswd.txt') as db_passwd_file:
            self.SERVICE_KEY=key_file.read() #SERVICE_KEY 초기화
            db_password=db_passwd_file.read()
        self.url=self.OPEN_APL_URL+self.SERVICE_KEY
        print(self.url)
        try:
            self.conn=pymysql.connect(host='localhost',user='root',password=db_password
                                      ,db='project_algo',charset='utf8')
        except pymysql.err.OperationalError: #db connection 실패
            print('DB connection 실패')
            sys.exit(-1)
    
    def get_store_committee_info(self): 
        try:
            res=urllib.request.urlopen(self.url).read().decode()
            soup=BeautifulSoup(res,'html.parser')
            commit_count=1
            with self.conn.cursor() as insert_curs:
                for committee_info in soup.findAll('item'):
                    if not commit_count==1: #전체 값은 제외
                        committeeCode=committee_info.find('committeecode').get_text()
                        committeename=committee_info.find('committeename').get_text()
                        insert_curs.execute(self.INSERT_SQL,(committeeCode,committeename))
                    
                    commit_count+=1
            self.conn.commit();        
           
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
            
    def print_committee(self): #입법 정보 xml 확인용 출력함
        try:
            res=urllib.request.urlopen(self.url).read().decode()
            print(res)
        except Exception as e: #HTTP 에러
            print('출력 실패:',e)
            sys.exit(-1)
            

if __name__ =='__main__':
    committee_information=CommitteeInformation()
    committee_information.print_committee()
    committee_information.get_store_committee_info()