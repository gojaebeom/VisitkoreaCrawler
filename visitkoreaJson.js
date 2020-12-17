/**@VISITKOREA_JSON_CRAWLER */

/**
 * ## 만약 검색 데이터를 바꾸고 싶은경우 ##
 * call? 뒤에오는 쿼리스트링의 값을 수정할 수 있음
 * > page= 뒤의 값은 page 번호
 * > cnt= 뒤의 값은 가져올 데이터의 개수
 * > sortkind= 뒤의 값은 정렬기준 (1은 최신순, 3은 인기순)
 * > areaCode= 뒤의 값은 지역코드 (1은 서울)
 * > tagId= 뒤의 값은 태그코드를 받는데 ,로 구분하여 복수로 입력가능
 * 
 * ## 사용법 ##
 * 1. 하단의 `` 사이의 url을 복사하여 브라우저 주소창에 입력후 검색(Enter)
 * 2. 해당 페이지에서 개발자모드/콘솔 창에 URL 하단의 코드 전체 복붙하기
 * 
 * ## areaCode ##
 * 1.서울 2.인천 3.대구
 * 4.대구 5.광주 6.부산
 * 7.울산 8.세종 
 * 31.경기 32.강원 33.충북
 * 34.충남 35.경북 36.경남
 * 37.전북 38.전남 39.제주
 */
````````````````` URL ````````````````
https://korean.visitkorea.or.kr/call?
cmd=TOUR_CONTENT_LIST_VIEW
&month=All&areaCode=33
&locationx=0&locationy=0
&page=1&cnt=100
&stampId=1589345b-b030-11ea-b8bd-020027310001
&sigunguCode=All&typeList=typeAll
&sortkind=3
&tagId=
3f36ca4b-6f45-45cb-9042-265c96a4868c,
651c5b95-a5b3-11e8-8165-020027310001,
e6875575-2cc2-43ba-9651-28d31a7b3e23,
2d4f4e06-2d37-4e54-ad5c-172add6e6680,
23bc02b8-da01-41bf-8118-af882436cd3c,
d3fd4d9f-fbd4-430f-b5d5-291b4d9920be,
c24d515f-3202-45e5-834e-1a091901aeff
```````````````````````````````````````

/* iframe에서 데이터가 호출이 안되는 것을 방지하기 위한 멈춤기능 ⏱ */
const sleep = function(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

/* text를 json Type으로 바꾸어 추출 🍔 */
const getJsonList = function()
{
    const text = document.body.querySelector('pre').textContent;
    const json = JSON.parse(text);
    return json.body.result;
}

/* DOM 그리기 🎨 */
const domRedraw = function()
{
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.background = "linear-gradient(#F78181, #FA8258)";
    document.body.innerHTML = `
    <form id="bestForm" style="width:1000px;height:600px;padding:12px;border-radius:5px;background:#FFFFFF;overflow:auto;">
        <h1 style="color:'#2E2E2E';margin:10px 0px 20px 0px;">대한민국 구석구석 크롤러 🧀</h1>
        <br>
        <label for="date">서버에 데이터를 보내는 코드를 완성하여 데이터를 보내세요.</label>
        <button type="button" id="bestButton" style="padding:8px 15px;border:none;border-radius:3px;background:#084B8A;color:white;font-weight:bold;">
            DB에 데이터 저장하기
        </button>
        <br>
        <br>
        <label for="date">제목을 클릭하면 해당 게시물의 상세페이지로 이동합니다.</label>
        <table style="border-collapse:collapse;border: 1px solid #BDBDBD;width:100%;table-layout:fixed">
            <tr>
                <th style="border: 1px solid #BDBDBD;padding:8px;">No</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">제목</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">주소</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">이미지</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">태그</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">설명</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">관광지홈페이지</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">이용시간</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">주차</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">전화번호</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">이용료</th>
                
            </tr>
            <tbody id="productIdTbody" style="max-height:300px;overflow:hidden;"></tbody>
        </table>
    </form>
    <div id="detailIframeWrap" style="display:none;"></div>
    `;
}

/* 상세페이지 데이터 가져오기 */
const getDetailContent = async function(cotId, count)
{
    return new Promise((resolve, reject)=>
    {
        let iframe = document.createElement("iframe");
        iframe.src = `https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=${cotId}`;
        iframe.setAttribute(`id`, `iframe-${cotId}`);
        document.getElementById("detailIframeWrap").appendChild(iframe);
    
        document.getElementById(`iframe-${cotId}`).onload = async () => 
        {
            console.log(`1초 슬립`);
            await sleep(200);
            
            let detailText;
            let detailUrl;
            let useTime;
            let parking;
            let phoneNumber;
            let cost;

            if(iframe.contentWindow.document.querySelector("#detailGo > div:nth-child(1) > div > div.inr_wrap > div > p"))
            detailText = iframe.contentWindow.document.querySelector("#detailGo > div:nth-child(1) > div > div.inr_wrap > div > p").textContent;
            
            let total = iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li').length;

            for(let i = 0; i < total; i++)
            {
                if(iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('a') 
                && iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].getElementsByTagName('strong')[0].textContent == '홈페이지')
                {
                    detailUrl = iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('a').href;
                }
                    
                if(iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span') 
                && iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].getElementsByTagName('strong')[0].textContent == '이용시간')
                {
                    useTime = iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span').textContent;
                }
                    
                if(iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span') 
                && iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].getElementsByTagName('strong')[0].textContent == '주차')
                {
                    parking = iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span').textContent;
                }

                if(iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span') 
                && iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].getElementsByTagName('strong')[0].textContent == '문의 및 안내')
                {
                    phoneNumber = iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span').textContent;
                }
                   
                if(iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span') 
                && iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].getElementsByTagName('strong')[0].textContent == '입 장 료')
                {
                    cost = iframe.contentWindow.document.querySelector('.area_txtView.bottom').getElementsByTagName('li')[i].querySelector('span').textContent;
                }
            }

            resolve({detailText, detailUrl, useTime, parking, phoneNumber, cost});
        };
    });

}


/* json을 받아와 화면에 그리기 🎨 */
const viewJsonList = async function(jsonList)
{
    let count = 0;
    let allList = [];
    for(json of jsonList)
    {
        await sleep(500);
        ++count;
        let _detailText;
        let _detailUrl;
        let _useTime;
        let _parking;
        let _phoneNumber;
        let _cost;

        if(+json.contentType < 1000 )
        {
            let {detailText, detailUrl, useTime, parking, phoneNumber, cost} = await getDetailContent(json.cotId, count);
            _detailText = detailText;
            _detailUrl = detailUrl;
            _useTime = useTime;
            _parking = parking;
            _phoneNumber = phoneNumber;
            _cost = cost;
        }else
        {
            //일반 게시물 URL : https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=
            //유저 게시물 URL : https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=
            console.log(`%c ${count}번째 게시물은 유저가 등록한 게시물입니다. --> URL 오류방지`,'color:red');
            _detailText = '';
            _detailUrl  = '';
            _useTime  = '';
            _parking  = '';
            _phoneNumber  = '';
            _cost  = '';
        }

        productIdTbody.innerHTML += 
        `
        <tr style="height:30px;text-align:center;padding:8px;border-bottom:1px solid gray;">
            <td>${count}</td>
            <td class="bestInfoTd" title="${json.title}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
                <a href="https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=${json.cotId}" target="_blank">
                    ${json.title}
                </a>
            </td>
            <td class="bestInfoTd">${json.addr1}</td>
            <td class="bestInfoTd" title="${json.imgPath}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
                <img src="https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=${json.imgPath}" alt="cover" style="width:100px;height:50px;">
            </td>
            <td class="bestInfoTd" title="${json.tagName}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${json.tagName}</td>
            <td class="bestInfoTd" title="${_detailText}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${_detailText}</td>
            <td class="bestInfoTd" title="${_detailUrl}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${_detailUrl}</td>
            <td class="bestInfoTd" title="${_useTime}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${_useTime}</td>
            <td class="bestInfoTd" title="${_parking}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${_parking}</td>
            <td class="bestInfoTd" title="${_phoneNumber}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${_phoneNumber}</td>
            <td class="bestInfoTd" title="${_cost}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${_cost}</td>
        </tr>
        `;
        allList.push
        ({
            'title':json.title,
            'cotId':json.cotId,
            'addr':json.addr1,
            'imgPath':json.imgPath,
            'tagName':json.tagName,
            'detailText':_detailText,
            'detailUrl':_detailUrl,
            'useTime':_useTime,
            'parking':_parking,
            'phoneNumber':_phoneNumber,
            'cost':_cost
        });
        
    }

    return allList;
}

/* 연결된 서버가 있다면 해당 서버에 데이터 보내기 🎨 */
const sendMyServer = function(jsonList)
{
    let URL = `http://18.179.58.9:8000/visitkorea/store`;

    let form = document.createElement("form");
    form.setAttribute("charset", "UTF-8");
    form.setAttribute("method", "Post");  //Post 방식
    form.setAttribute("action", URL); //요청 보낼 주소

    let jsonInput = document.createElement("input");
    jsonInput.setAttribute("name", "json_list");
    jsonInput.setAttribute("value", JSON.stringify(jsonList));
    
    form.appendChild(jsonInput);
    document.body.appendChild(form)
    window.open('',`popForm`);
    form.target=`popForm`;
    form.submit();
}




async function init(){
    /** 함수 순차실행 */
    const jsonList = getJsonList();
    domRedraw();
    let allList = await viewJsonList(jsonList);
    console.log(allList);

    /**데이터베이스에 데이터 전송하는 클릭이벤트 */
    document.querySelector(`#bestButton`).onclick = () => 
    {
        console.log('데이터 전송!');
        sendMyServer(allList); 
    }
}

init();

