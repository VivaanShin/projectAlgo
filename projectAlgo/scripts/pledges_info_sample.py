# -*- coding: utf-8 -*-
"""
Created on Fri May 29 18:57:01 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_pledges_info values(%s,%s,%s,%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,(1,100120253,"정치","일자리 창출","일자리 100만개 창출",1))
    curs.execute(INSERT_DATA,(1,100119674,"경제","부동산 가격 감소","부동산 가격 50% 감소",0))
    curs.execute(INSERT_DATA,(1,100119904,"IT/과학","공인인증서 폐지","공인인증서 2년이내 폐지",1))
    curs.execute(INSERT_DATA,(1,100119649,"사회","청년 복지 ","청년 복지 증가",0))
    curs.execute(INSERT_DATA,(1,100120032,"문화","문화재 보호","문화재 보호를 위한 정책 수립",1))
    
    
conn.commit()
conn.close()