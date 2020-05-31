# -*- coding: utf-8 -*-
"""
Created on Fri May 29 18:43:50 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_user_politician_grade values(%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,("id123",100120253,5))
    curs.execute(INSERT_DATA,("id345",100119674,6))
    curs.execute(INSERT_DATA,("id789",100119904,4))
    curs.execute(INSERT_DATA,("id1234",100120032,8))
    curs.execute(INSERT_DATA,("id123",100120032,7))
    
    
    
conn.commit()
conn.close()