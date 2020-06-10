# -*- coding: utf-8 -*-
"""
Created on Tue May  5 00:06:02 2020

@author: User
"""

import sys
import pymysql
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
from urllib.error import URLError,HTTPError


class PromisesInformation:
     OPEN_API_URL='http://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire?serviceKey='
     SERVICE_KEY=''
     #추후 db에 맞게 수정
     #21대 국회의원 정보만 필요하므로 하나만 가져옴
     GET_POLITICIAN_ID='select politician_no from tb_politician_info'
     INSERT_SQL="""insert into tb_pledges_info (prmsOrd,politician_no,prmsRealmName,prmsTitle,prmsCont,prmsState)
                    SELECT %s,%s, %s, %s, %s, %s from dual
                    where not exists
                    (
                        select *
                        from tb_pledges_info
                        where prmsOrd=%s and politician_no=%s 
                    )
                    """
         #정치인 공약개수 업데이트
     UPDATE_SQL="""update tb_politician_info
           set prmsCnt=%s
           where politician_no=%s
           """
     def __init__(self):
        with open('promiseKey.txt','r') as key_file, open('dbPasswd.txt') as db_passwd_file:
            self.SERVICE_KEY=key_file.read() #SERVICE_KEY 초기화 
            db_password=db_passwd_file.read()
            
        with open('sgId.txt') as sdId_file, open('sgTypecode.txt') as sd_code_file:
            self.sgId=sdId_file.read()
            self.sgType=sd_code_file.read()
            self.sgType=4;
            
        self.url=self.OPEN_API_URL+self.SERVICE_KEY
        try:
            self.conn=pymysql.connect(host='localhost',user='root',password=db_password
                                      ,db='project_algo',charset='utf8') #후에 db상황에 맞게 수정
        except pymysql.err.OperationalError: #db connection 실패
            print('DB connection 실패')
            sys.exit(-1)
            
     def get_request_info(self):
         try:
            self.get_promises_url=self.url+'&sgId='+urllib.parse.quote_plus(self.sgId)+'&sgTypecode='+urllib.parse.quote_plus(self.sgType)+'&cnddtId='
            print(self.get_promises_url)
            #모든 정치인의 공약정보를 가져오기 위해 정치인 정보 테이블에서 모든 정치인의 ID를 가져옴
            with self.conn.cursor() as curs:
                curs.execute(self.GET_POLITICIAN_ID)
                self.politician_id_list=curs.fetchall()
            #필수 요청값만 넣음
         except Exception as e:
            print('db 에러:',e)
    
     def get_store_promises_information(self):
         self.get_request_info()
         
         try:
             with self.conn.cursor() as insert_curs, self.conn.cursor() as update_curs:
                 for politician_id in self.politician_id_list:
                     res=urllib.request.urlopen(self.get_promises_url+urllib.parse.quote_plus(str(politician_id[0]))).read().decode()
                     soup=BeautifulSoup(res,'html.parser')
                 
                 # 정치인의 모든 공약 정보를 세팅함
                     prms_list=[]
                     prms_index=1 #값을 가져올 인덱스
                     prmsCnt=int(soup.find('item').prmsCnt.get_text())
                 
                 #item 항목에서 모두 가져옴
                     for prms in soup.findAll('item'):
                         prmsRealmName=prms.find('prmsrealmname'+str(prms_index)).get_text() if prms.find('prmsrealmname'+str(prms_index)) else '없음'
                         prmsTitle=prms.find('prmstitle'+str(prms_index)).get_text()
                         prmsCont=prms.find('prmscont'+str(prms_index)).get_text() if prms.find('prmscont'+str(prms_index)) else '없음'
                         new_prms_dic={}
                         
                     
                         new_prms_dic['prmsRealmName']=prmsRealmName
                         new_prms_dic['prmsTitle']=prmsTitle
                         new_prms_dic['prmsCont']=prmsCont
                         new_prms_dic['prmsOrd']=prms_index #공약 순번이 정보에 없을 경우를 대비해서, item의 순서대로 공약 순번 저장
                         
                         print(prmsRealmName)
                         print(prmsTitle)
                         print(prmsCont)
                         
                         prms_list.append(new_prms_dic)
                         prms_index+=1
                 #가져온 항목들을 모두 저장
                     for insert_prms in prms_list:
                     #prmsState default=0
                         insert_curs.execute(self.INSERT_SQL,(insert_prms['prmsOrd'],politician_id[0],insert_prms['prmsRealmName'],
                                  insert_prms['prmsTitle'],insert_prms['prmsCont'],0,insert_prms['prmsOrd'],politician_id[0]))
                         
            
                     update_curs.execute(self.UPDATE_SQL,(prmsCnt,politician_id[0])) #공약정보 저장 한 뒤 정치인 공약 수 갱신
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
     def print_prms(self): #xml 확인용 출력함수
        self.get_request_info()
        try:
           for politician_id in self.politician_id_list:
               url=self.get_promises_url+urllib.parse.quote_plus(str(politician_id[0]))
               print(url)
               res=urllib.request.urlopen(url).read().decode()
               print(res)
        except Exception as e: #HTTP 에러
            print('출력 실패:',e)
            sys.exit(-1)
            
     def __del__(self):
         self.conn.close()
         

if __name__=='__main__':
    promise_information=PromisesInformation()
    promise_information.print_prms()
    promise_information.get_store_promises_information()
            
                
