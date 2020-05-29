# -*- coding: utf-8 -*-
"""
Created on Fri May 29 15:57:23 2020

@author: User
"""
import pymysql

INSERT_USER_DATA="""insert into tb_user_info values(%s,%s,%s,%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_USER_DATA,("id123","123456","id123@naver.com","010-1234-5678",
                                   False,False))
    curs.execute(INSERT_USER_DATA,("id345","572292","id345@naver.com","010-5678-9967",
                                   True,False))
    curs.execute(INSERT_USER_DATA,("id789","329843","id789@naver.com","010-3459-2321",
                                   True,False))
    curs.execute(INSERT_USER_DATA,("id1234","212121","id1234@gmail.com","010-0923-2123",
                                   False,False))
    curs.execute(INSERT_USER_DATA,("admin","admin","admin@gmail.com","010-0923-2123",
                                   False,False))

conn.commit()
conn.close()