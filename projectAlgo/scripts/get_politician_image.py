# -*- coding: utf-8 -*-
"""
Created on Sun May  3 17:39:18 2020

@author: User
"""

import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

NAVER_URL='https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='
IMAGE_FOLDER_PATH='../public/images/'
def get_politician_image(politician_name,politician_no): #정치인의 이미지를 네이버에서 가져오는 모듈
    url=NAVER_URL+urllib.parse.quote_plus(politician_name)
    
    try:
        res=urllib.request.urlopen(url).read()
        soup=BeautifulSoup(res,'html.parser')
        img_thumb=soup.find('div',class_='big_thumb')
        
        if img_thumb:
            img_url=img_thumb.find('img')['src']
        
        else:
            img_thumb=soup.find('ul',class_='temp') #동명이인이 많이 존재시 처리
            img_url=img_thumb.find('img')['src']
                
            print(img_url)
            
        urllib.request.urlretrieve(img_url,IMAGE_FOLDER_PATH+str(politician_no)+'.jpg')
        #이미지 이름은 당선인 정보에서 가져오는 정치인 코드로 함
        return True
             
    except:
        return False

if __name__ == '__main__':
    get_politician_image('이낙연', 1000000) #Test
    
   