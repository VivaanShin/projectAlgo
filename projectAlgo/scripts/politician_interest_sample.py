# -*- coding: utf-8 -*-
"""
Created on Fri May 29 18:50:30 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_politician_interest values(%s,%s,%s,%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,(100120253,5,5,5,5,5))
    curs.execute(INSERT_DATA,(100119674,6,7,3,4,8))
    curs.execute(INSERT_DATA,(100119904,4,7,5,2,9))
    curs.execute(INSERT_DATA,(100120032,8,5,4,7,7))
    curs.execute(INSERT_DATA,(100119649,7,5,4,5,9))
    
    
conn.commit()
conn.close()