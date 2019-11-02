// サンプルデータ
let sampleData =
    [
        {
            content: "1",
            childrenData: [
                {
                    content: "2",
                    childrenData: [
                        {
                            content: "3",
                            childrenData: [
                                {
                                    content: "4"
                                },
                                {
                                    content: "5"
                                }
                            ]
                        },
                        {
                            content: "6",
                        },
                        {
                            content: "7",
                            childrenData: [
                                {
                                    content: "8"
                                },
                                {
                                    content: "9"
                                }
                            ]
                        }
                    ]
                },
                {
                    content: "10",
                    childrenData: [
                        {
                            content: "11",
                            childrenData: [
                                {
                                    content: "12"
                                }
                            ]
                        },
                        {
                            content: "13"
                        }
                    ]
                }
            ]
        }
    ];


let svg = null;
$(function(){
    // SVG要素生成
    svg = $(`<svg id="drawSvgField" x="0" y="0" width="2000" height="2000" viewBox="0 0 2000 2000"></svg>`).appendTo($("#drawField"));

    // 描画
    drawFlow(sampleData);
});

// データから図を生成
// param data [{content:ボックス内要素, child:[data]}]
function drawFlow(contentData){
    let offset = {x:20, y:20};
    let startPos = {x:20, y:20};
    let boxSize = {height: 32, width: 120};
    draw(contentData[0], startPos);

    // param data データ
    // param pos 設置位置
    // return childNum 自身を起点とした葉の数
    function draw(data, pos, parent){
        let box = drawBox(data.content, pos);
        if(parent) {
            let parentOffset = considerSvgOffset($(parent).offset());
            let offset = considerSvgOffset($(box).offset());
            drawPath(
                {
                x: parentOffset.x + boxSize.width,
                y: parentOffset.y + boxSize.height / 2},
                {
                x: offset.x,
                y: offset.y + boxSize.height / 2
            });
        }
        if(!data.childrenData) return 1;
        let childNum = 0;
        data.childrenData.forEach(function(child){
            let childPos = calcChildBoxPos(pos, childNum);
            childNum += draw(child, childPos, box);
        });
        return childNum;
    }

    // 親Boxの位置, 同列のBoxの子の数, indexから子Boxの位置を計算
    // param parentPos = {x, y} 親Boxの位置
    // param childNum 自分よりも上に描画される葉の数
    // return pos 子Boxの位置
    function calcChildBoxPos(parentPos, childNum){
        return {x: parentPos.x + boxSize.width + offset.x,
                y: parentPos.y + (boxSize.height + offset.y) * childNum};
    }

// Boxの生成
// param content 内部要素
// param p 生成座標
// return Box要素
    function drawBox(content, p){
        return $(`<table class="flowBox" style="height:${boxSize.height};width:${boxSize.width};left:${p.x}px;top:${p.y}px;"><tbody><tr><td>${content}</td></tr></tbody></table>`).appendTo($("#drawField"));
    }

// 折れ線の生成
// param p_start = {x, y} 始点
// param p_end = {x, y} 終点
    function drawPath(p_start, p_end){
        let svgUrl = 'http://www.w3.org/2000/svg';
        var path = document.createElementNS(svgUrl, "path");
        let p_def = 50; //始点終点から制御点までの距離
        path.setAttribute('d', `M ${p_start.x},${p_start.y} L${(p_start.x + p_end.x)/2},${p_start.y} ${(p_start.x + p_end.x)/2},${p_end.y} ${p_end.x},${p_end.y}`);
        path.setAttribute('stroke', "black");
        path.setAttribute('fill', "transparent");
        path.setAttribute('stroke-width', "2px");
        document.getElementById("drawSvgField").appendChild(path);
    }

// SVGの表示位置のズレを引く
// param point={x, y}
// return 計算後の座標
    function considerSvgOffset(point){
        console.log(point);
        let p = {x:0, y:0};
        p.x = point.left - $(svg).offset().left;
        p.y = point.top - $(svg).offset().top;
        return p;
    }
}

