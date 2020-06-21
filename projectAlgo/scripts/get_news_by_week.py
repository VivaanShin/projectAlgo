# -*- coding: utf-8 -*-
"""
Created on Wed May  6 08:44:09 2020

@author: User
"""

import sys
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import re
import json

#시간값 처리용 출처:https://bumcrush.tistory.com/116
def date_cleaning(text):
    try:
        pattern = '\d+.(\d+).(\d+).' #날짜 정규표현식
        r = re.compile(pattern)
        match = r.search(text).group(0)
        return_text=match
    except AttributeError: #최근 정보 처리
        pattern = '\w* (\d\w*)' #~일 전 정규표현식(ex)2일전)
        r = re.compile(pattern)
        match = r.search(text).group(1)
        return_text=match
    finally:
        return return_text;

if(len(sys.argv)<3):
    print("정보 모두 입력 필요")
    sys.exit(-1)
    
name=urllib.parse.quote_plus(sys.argv[1]) #이름
start_day=urllib.parse.quote_plus(str(sys.argv[2]).replace('-', '')) #시작 날짜
end_day=urllib.parse.quote_plus(str(sys.argv[3]).replace('-', '')) #마지막 날짜

#날짜 검색 Url
search_url="""https://search.naver.com/search.naver?where=news&sm=tab_opt&sort=0&photo=0&field=0&pd=3&ds={}&de={}&query={}""".format(start_day,end_day,name)

res=urllib.request.urlopen(search_url).read().decode('utf-8');
soup=BeautifulSoup(res,'html.parser')

news_ul=soup.find('ul',class_='type01')
news_list={'articleList':[]} #JSON 전환용 dic_list
news_index=0;
for news in news_ul.findAll('li',id=re.compile('sp_nws')):
    
    if(news_index >=3):
        break;
    new_news={}
    new_news_each_title=news.find('a',class_='_sp_each_title') #제목 select
    new_news_txt_inline=news.find('dd',class_='txt_inline')#날짜를 가져오기 위한 영역
    new_news_sp_each_source=news.find('span',class_='_sp_each_source') #언론사를 가져오기 위한 값
    new_news['articleTitle']=new_news_each_title.text #제목
    new_news['articleLink']=new_news_each_title['href'] #기사 링크
    new_news['articlePress']=new_news_sp_each_source.text #언론사 (선정) 값 일단 놔눔
    new_news['articleDay']=date_cleaning(new_news_txt_inline.text)#기사 날짜
    
    
    news_list['articleList'].append(new_news)
    news_index+=1
    
print(json.dumps(news_list['articleList'])) #JSON으로 node.js python-shell에 반환
 