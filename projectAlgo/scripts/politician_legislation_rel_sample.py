# -*- coding: utf-8 -*-
"""
Created on Fri May 29 20:07:44 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_politician_legislation_rel values(%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,("PRC_K1F6K0V5V1L9N0K8G5O8Q0Y9O0R9Q4",100120253))
    curs.execute(INSERT_DATA,("PRC_I1L6K0H5V1W9I0L8M5R7C2I6B8X5P4",100119674))
    curs.execute(INSERT_DATA,("PRC_Z1P6O0W5X1V1N1Z4T0Y1R1H1H7Z2Q2",100119904))
    curs.execute(INSERT_DATA,("PRC_M1V6S0Z5K1R1X1E4L0H0B1C0K9P7G8",100120032))
    curs.execute(INSERT_DATA,("PRC_G1L6S0E5T0J9E1R7X3B9D2V0T7Y2X9",100119649))
    
conn.commit()
conn.close()