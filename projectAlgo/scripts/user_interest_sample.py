# -*- coding: utf-8 -*-
"""
Created on Fri May 29 16:12:18 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_user_interest values (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,("id123","학생",20, 5, 5, 5, 5, 5,"2020-05-27"))
    curs.execute(INSERT_DATA,("id345","교수",50,5,6,7,8,9,"2020-05-28"))
    curs.execute(INSERT_DATA,("id789","사업가",45,4,9,7,6,5,"2020-05-29"))
    curs.execute(INSERT_DATA,("id1234","회사원",30,1,2,9,8,3,"2020-05-30"))
    curs.execute(INSERT_DATA,("admin","회사원",27,3,6,8,3,6,"2020-05-31"))

conn.commit()
conn.close()