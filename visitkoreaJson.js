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
 */
````````````````` URL ````````````````
https://korean.visitkorea.or.kr/call?
cmd=TOUR_CONTENT_LIST_VIEW
&month=All&areaCode=2
&locationx=0&locationy=0
&page=1&cnt=200
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

//2. 해당 페이지에서 개발자모드/콘솔 창에 아래 코드 복붙하기
class VisitkoreaParser
{
    constructor()
    {

    }

    /* text를 json Type으로 바꾸어 추출 🍔 */
    getJsonList()
    {
        const text = document.body.querySelector('pre').textContent;
        const json = JSON.parse(text);
        return json.body.result;
    }

    /* 로직 미구현 */
    async getDetailContent(cotId)
    {
        let iframe = document.createElement("iframe");
        iframe.src = `https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=${cotId}`;
        iframe.setAttribute(`id`, `iframe`);
        document.getElementById("detailIframeWrap").appendChild(iframe);

        document.getElementById(`iframe`).onload = () => 
        {

        };
    }

    /* DOM 그리기 🎨 */
    domRedraw()
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
                </tr>
                <tbody id="productIdTbody" style="max-height:300px;overflow:hidden;"></tbody>
            </table>
        </form>
        <div id="detailIfameWrap" style=""></div>
        `;
    }

    /* json을 받아와 화면에 그리기 🎨 */
    viewJsonList(jsonList)
    {
        let i = 0;
        for(json of jsonList)
        {
            productIdTbody.innerHTML += 
            `
            <tr style="height:30px;text-align:center;padding:8px;border-bottom:1px solid gray;">
                <td>${++i}</td>
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
            </tr>
            `;
        }
    }

    /* 연결된 서버가 있다면 해당 서버에 데이터 보내기 🎨 */
    sendMyServer(jsonList)
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
}

const vp = new VisitkoreaParser();
const jsonList = vp.getJsonList();
                 vp.domRedraw();
                 vp.viewJsonList(jsonList);

document.querySelector(`#bestButton`).onclick = () => {
    console.log('데이터 전송!')
    vp.sendMyServer(jsonList);
}