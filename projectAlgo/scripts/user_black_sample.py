# -*- coding: utf-8 -*-
"""
Created on Fri May 29 16:07:30 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_user_black values(%s,%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,("2020-05-27","2020-06-27","id345","테스트1"))
    curs.execute(INSERT_DATA,("2020-05-28","2020-06-28","id789","테스트2"))

conn.commit()
conn.close()