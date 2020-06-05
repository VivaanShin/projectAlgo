# -*- coding: utf-8 -*-
"""
Created on Tue May  5 14:26:04 2020

@author: User
"""

import sys
import pymysql
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
from urllib.error import URLError,HTTPError

class LegislationInformaion: #OPEN API에서 의안 정보를 가져오는 클래스
    OPEN_API_URL='http://apis.data.go.kr/9710000/BillInfoService2/getBillInfoList?serviceKey='
    SERVICE_KEY=''
    ORD=urllib.parse.quote_plus('A01')
    START_ORD='20'
    END_ORD='20'
    GBN=urllib.parse.quote_plus('dae_num_name')
    GET_POLITICIAN_NAME='select politician_name from tb_politician_info'
    GET_POLITICIAN_ID_BY_NAME="""select politician_id from tb_politician_info
                              where politician_name=%s
                              """
    INSERT_LEGISLATION=""" insert into tb_politician_legislation (issue_id,issue_no,issue_name,proposerKind,
                           proposeDt,procDt,generalResult,summary,procStageCd,passGubn,curr_committee)
                           select '%s', '%s', '%s', '%s','%s','%s','%s','%s','%s','%s','%s' from dual
                           where not exists
                           (
                               select * 
                               from tb_politician_legislation
                               where issue_id=%s
                           )
                       """
    INSERT_REL=""" insert into tb_politician_legislation_rel (issue_id,politician_no)
                   select '%s','%s' from dual
                   where not exists
                   (
                       select *
                       from tb_politician_legislation_rel
                       where issue_id=%s and politician_no=%s
                   )
                   and exists
                   (
                       select * 
                       from tb_politician_legislation
                       where issue_id=%s
                   )
                   and exists
                   (
                       select *
                       from tb_politician_info
                       where politician_no=%s
                   )
               """ #해당 테이블이 모두 FK이므로 참조하는 테이블에 데이터가 있는지도 확인
    SELECT_COMMITTEE="""select committeeCode from tb_"""
    #후에 소관위 테이블 설정되면 변경
    def __init__(self):
        with open('legislationKey.txt','r') as key_file, open('dbPasswd.txt') as db_passwd_file:
            self.SERVICE_KEY=key_file.read() #SERVICE_KEY 초기화
            db_password=db_passwd_file.read()
        self.url=self.OPEN_API_URL+self.SERVICE_KEY
        self.regislation_rel=[] #정치인과 입법정보 관계 저장 튜플 리스트
        try:
            self.conn=pymysql.connect(host='localhost',user='root',password=db_password
                                      ,db='project_algo',charset='utf8') #후에 db상황에 맞게 수정
        except pymysql.err.OperationalError: #db connection 실패
            print('DB connection 실패')
            sys.exit(-1)
    def get_request_info(self):
         try:
             #필수 요청값만 넣음
             self.get_legislation_url=self.url+'&ord='+self.ORD+'&start_ord='+self.START_ORD+'&end_ord='+self.END_ORD+'&gbn='+self.GBN+'&numOfRows=5000'
           
            #모든 정치인의 발의안 정보를 가져오기 위해 정치인 정보 테이블에서 모든 정치인의 이름을 가져옴
             with self.conn.cursor() as curs:
                 curs.execute(self.GET_POLITICIAN_NAME)
                 self.politician_name_list=curs.fetchall()
         except Exception as e:
            print('db 에러:'+e)
    def get_committee_info(self): #의안 정보 저장시 소관위 정보 저장 및 사용을 위해 리스트를 먼저 만드는 함수
        try:
            with self.conn.cursor() as select_curs:
                select_curs.execute(self.SELECT_COMMITTEE)
                committee_code_list=select_curs.fetchall()
                
                for committee_code in committee_code_list:
                    if not committee_code[0] == '전체': #전체 값은 제외함
                        self.committee_list.append(committee_code[0])
        except HTTPError as e: #HTTP 에러
            print('Error code: ', e.code)
            sys.exit(-1)
        except URLError as e: #URL 에러
            print('URL 실패: ', e.reason)
            sys.exit(-1)
        except Exception as e: #DB 에러
            print('DB 에러: ',e)
            sys.exit(-1)
            
    def get_store_legislation(self): #먼저 의안 정보를 저장함
        self.get_request_info()
        self.get_committee_info()
        try:
            with self.conn.cursor() as insert_curs:
                for politician_name in self.politician_name_list:
                    for committee_code in self.committee_list: #소관위 값을 위해 소관위 코드정보를 참조 DB에서 가져오는 코드로 변경
                        res=urllib.request.urlopen(self.get_legislation_url+'&mem_name='+urllib.parse.quote_plus(politician_name[0])
                                               +'&curr_committee='+urllib.parse.qutoe_plus(committee_code)).read().decode('utf-8')
                        print(res)
                        soup=BeautifulSoup(res,'html.parser')
                    
                        #정치인이 발의한 의안 리스트  
                        legislation_list=soup.findAll('item')
                    
                        if(legislation_list): #발의한 의안이 있을 시만 동작
                    #정치인 이름으로 아이디를 가져옴
                            for legislation in legislation_list:
                                issue_id=legislation.billId.string
                                issue_no=legislation.billNo.string
                                issue_name=legislation.billName.string
                                proposerKind=legislation.proposerKind.string
                                proposeDt=legislation.proposeDt.string
                                procDt=legislation.procDt.string if legislation.procDt else '0000-00-00'
                                generalResult=legislation.generalResult.string if legislation.generalResult else '없음'
                                summary=legislation.summary.string if legislation.summary else '없음'
                                procStageCd=legislation.procStageCd.string
                                passGubn=legislation.passGubn.string
                                curr_committee=int(committee_code)
                                
                                insert_curs.execute(self.INSERT_LEGISLATION,(issue_id,issue_no,issue_name,proposerKind,
                                                                            proposeDt,procDt,generalResult,summary,
                                                                            procStageCd,passGubn,curr_committee,issue_id))
                                
                                self.regislation_rel.append((politician_name[0],issue_id))
                                #입법정보 저장
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
    def store_legislation_rel(self): #반드시 의안정보랑 정치인 신상정보 저장된 상태에서 사용
        try:
            with self.conn.cursor() as select_curs, self.conn.cursor() as insert_curs:
                for rel_info in self.regislation_rel:
                    select_curs(self.GET_POLITICIAN_ID_BY_NAME,(rel_info[0]))
                    politician_no=select_curs.fetchone()[0]
                    insert_curs(self.INSERT_REL(rel_info[1],politician_no,rel_info[1],politician_no))
                    
            self.conn.commit()
        except Exception as e: #DB 에러
            self.conn.rollback()
            print('DB 에러: ',e)
            sys.exit(-1)
    
    def print_leg(self): #입법 정보 xml 확인용 출력함수
        self.get_request_info()
        self.get_committee_info()
        try:
            for politician_name in self.politician_name_list:
                for committee_code in self.committee_list: #소관위 값을 위해 소관위 코드정보를 참조
                    res=urllib.request.urlopen(self.get_legislation_url+'&mem_name='+urllib.parse.quote_plus(politician_name[0])
                                               +'&curr_committee='+urllib.parse.qutoe_plus(committee_code)).read().decode('utf-8')
                    print(res)
        except Exception as e: #HTTP 에러
            print('출력 실패:',e)
            sys.exit(-1)
    
    def print_committee(self): #소관위 정보 xml 확인용
        self.get_request_info()
        try:
            res=urllib.request.urlopen(self.committee_url).read().decode('utf-8')
            print(res);
        except Exception as e: #HTTP 에러
            print('출력 실패:',e)
            sys.exit(-1)
            
    def __del__(self):
        self.conn.close()

if __name__ =='__main__':
    legislation_information=LegislationInformaion()
    legislation_information.print_leg()
    legislation_information.print_committee()
    legislation_information.get_store_legislation()
    legislation_information.store_legislation_rel()
        