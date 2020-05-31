# -*- coding: utf-8 -*-
"""
Created on Fri May 29 19:04:46 2020

@author: User
"""

import pymysql

INSERT_DATA="""insert into tb_politician_legislation values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
conn=pymysql.connect(host='localhost',user='root',password='algoalgo'
                                      ,db='project_algo',charset='utf8')

with conn.cursor() as curs:
    curs.execute(INSERT_DATA,("PRC_K1F6K0V5V1L9N0K8G5O8Q0Y9O0R9Q4","1918735","국민권익위원회 위원(이호용) 추천안(의장)",
                              "의장","2016-05-19","2016-05-19","원안가결","없음","본회의의결","처리의안", 9700439))
    curs.execute(INSERT_DATA,("PRC_I1L6K0H5V1W9I0L8M5R7C2I6B8X5P4","1918734","원자력안전위원회 위원(정재준) 추천안(의장)",
                              "의장","2016-05-19","2016-05-19","원안가결","없음","본회의의결","처리의안", 9700410))
    curs.execute(INSERT_DATA,("PRC_Z1P6O0W5X1V1N1Z4T0Y1R1H1H7Z2Q2","1918733","문화기본법 일부개정법률안(대안)(교육문화체육관광위원장)",
                              "위원장","2016-05-18","2016-05-19","원안가결","1. 제안이유 이상 2건의 「문화기본법 일부개정법률안」이 제342회 국회(2016. 5. 11) 제1차 법안심사소위원회에서 함께 심사·의결됨에 따라 이를 통합하여 대안을 마련함. 2. 주요내용 가. 한국문화관광연구원의 설립근거를 법에 명시 나. 문화가 있는 날의 지정·운영에 대한 법적 근거를 마련"
                              ,"공포","처리의안", 9700406))
    curs.execute(INSERT_DATA,("PRC_M1V6S0Z5K1R1X1E4L0H0B1C0K9P7G8","1918732","고도 보존 및 육성에 관한 특별법 일부개정법률안(대안)(교육문화체육관광위원장)",
                              "위원장","2016-05-18","2016-05-19","원안가결","없음","공포","처리의안", 9700406))
    curs.execute(INSERT_DATA,("PRC_G1L6S0E5T0J9E1R7X3B9D2V0T7Y2X9","1918731","자원순환기본법안(대안)(환경노동위원장)",
                              "의장","2016-05-18","2016-05-19","원안가결","없음","공포","처리의안",9700038))
    
conn.commit()
conn.close()