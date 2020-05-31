# -*- coding: utf-8 -*-
"""
Created on Fri May 29 18:36:12 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_gradeinfo_record values(%s,%s,%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,("2020-05-27","2020-06-03","id123",100120253,5))
    curs.execute(INSERT_DATA,("2020-05-28","2020-06-04","id345",100119674,6))
    curs.execute(INSERT_DATA,("2020-05-29","2020-06-05","id789",100119904,4))
    curs.execute(INSERT_DATA,("2020-05-30","2020-06-06","id1234",100120032,8))
    curs.execute(INSERT_DATA,("2020-05-31","2020-06-07","id123",100120032,7))
    
    
conn.commit()
conn.close()