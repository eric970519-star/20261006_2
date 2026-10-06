// 宣告題目資料陣列，包含 5 道 p5.js 簡易指令測驗
const questions = [
  {
    question: "在 p5.js 中，用來設定畫布寬高大小的函式是什麼？",
    options: ["createCanvas()", "setSize()", "windowSize()", "canvasSize()"],
    answer: 0 // 正確選項的索引值
  },
  {
    question: "哪個函式是用來設定背景顏色的？",
    options: ["color()", "background()", "fill()", "setBg()"],
    answer: 1
  },
  {
    question: "要在畫布上繪製一個矩形，應該使用下列哪一個指令？",
    options: ["circle()", "ellipse()", "rect()", "squareShape()"],
    answer: 2
  },
  {
    question: "用來設定圖形內部填滿顏色的指令是？",
    options: ["stroke()", "colorFill()", "background()", "fill()"],
    answer: 3
  },
  {
    question: "p5.js 中預設每秒執行 draw() 函式多少次（更新畫面頻率）？",
    options: ["12次", "30次", "60次", "120次"],
    answer: 2
  }
];

let currentQuestion = 0;   // 記錄目前題目的索引編號 (從 0 到 4)
let score = 0;             // 記錄累計答對的題數
let selectedOption = null; // 記錄使用者當前點選的選項索引
let isAnswered = false;    // 記錄當前題目是否已經完成作答
let nextButton;            // 宣告「下一題」按鈕物件

function setup() {
  // 建立佔滿整個瀏覽器視窗的全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 建立「下一題」按鈕並設定初始屬性
  nextButton = createButton('下一題');
  positionNextButton(); // 呼叫自訂函式設定按鈕位置與尺寸
  nextButton.style('font-size', '16px'); // 設定按鈕字型大小
  nextButton.style('cursor', 'pointer'); // 設定滑鼠游標為手指圖示
  nextButton.hide(); // 初始時將按鈕隱藏，等作答後才顯示
  
  // 當按鈕被點擊時，觸發 nextQuestion 函式進入下一題
  nextButton.mousePressed(nextQuestion);
}

function draw() {
  background(240, 244, 248); // 設定畫布背景顏色為柔和的灰藍色
  
  // 判斷是否還有題目尚未作答完畢
  if (currentQuestion < questions.length) {
    drawQuizUI(); // 繪製測驗介面與題目選項
  } else {
    drawResultUI(); // 5 題皆完成後，繪製最終結算畫面
  }
}

// 繪製測驗介面函式
function drawQuizUI() {
  let q = questions[currentQuestion]; // 取得當前題目的資料物件
  
  // 計算響應式介面寬度與自動縮放的字型大小
  let uiWidth = min(width * 0.85, 650); 
  let titleSize = constrain(width * 0.035, 18, 26); 
  let qTextSize = constrain(width * 0.028, 14, 20); 
  let optTextSize = constrain(width * 0.025, 14, 18); 
  
  // 繪製頂端標題與目前進度文字
  fill(30); // 設定文字顏色為深灰色
  noStroke(); // 取消外框線
  textSize(titleSize); // 設定標題字體大小
  textAlign(CENTER, TOP); // 設定文字對齊方式為置中偏上
  text(`p5.js 簡易指令測驗 ( 第 ${currentQuestion + 1} / ${questions.length} 題 )`, width / 2, height * 0.08);
  
  // 設定題目框的座標與高度
  let qBoxY = height * 0.22;
  let qBoxHeight = max(70, height * 0.12);
  
  // 繪製題目內容的外框矩形
  fill(255); // 填滿白色背景
  stroke(200); // 設定框線顏色
  strokeWeight(2); // 設定框線粗細
  rectMode(CENTER); // 以中心點座標繪製矩形
  rect(width / 2, qBoxY, uiWidth, qBoxHeight, 10); // 畫出帶有圓角的矩形題目框
  
  // 繪製題目文字
  fill(50); // 設定題目文字顏色
  noStroke(); // 取消框線
  textSize(qTextSize); // 設定題目字體大小
  textAlign(CENTER, CENTER); // 文字置中對齊
  text(q.question, width / 2, qBoxY); // 顯示題目內容
  
  // 設定 4 個選項的起始位置與間距
  let startY = qBoxY + qBoxHeight / 2 + 30;
  let boxHeight = max(45, height * 0.07);
  let spacing = 15;
  
  // 迴圈繪製 4 個選項按鈕
  for (let i = 0; i < q.options.length; i++) {
    let boxY = startY + i * (boxHeight + spacing); // 計算每個選項的 Y 軸位置
    
    // 判斷滑鼠游標是否懸停在該選項上方
    let isHover = mouseX > width / 2 - uiWidth / 2 && 
                  mouseX < width / 2 + uiWidth / 2 && 
                  mouseY > boxY && mouseY < boxY + boxHeight;
    
    // 設定預設選項的背景與框線顏色
    fill(255);
    stroke(180);
    strokeWeight(1);
    
    // 如果當前題目已經完成作答
    if (isAnswered) {
      if (i === q.answer) {
        // 不論答對或答錯，正確選項一律加上指定的 #caf0f8 背景顏色
        fill(202, 240, 248); // #caf0f8 對應的 RGB 數值
        stroke(0, 150, 200); // 加強正確選項的邊框顏色
      } else if (i === selectedOption && selectedOption !== q.answer) {
        // 如果使用者選錯，其點選的錯誤選項顯示淡紅色標示
        fill(255, 200, 200);
      }
    } else if (isHover) {
      // 滑鼠懸停時顯示淡藍色互動特效
      fill(230, 240, 255);
    }
    
    // 繪製選項方框
    rect(width / 2, boxY + boxHeight / 2, uiWidth, boxHeight, 8);
    
    // 繪製選項文字
    fill(40);
    noStroke();
    textSize(optTextSize);
    textAlign(LEFT, CENTER);
    text(`${i + 1}. ${q.options[i]}`, width / 2 - uiWidth / 2 + 20, boxY + boxHeight / 2);
  }
}

// 繪製結算畫面函式
function drawResultUI() {
  fill(30); // 設定標題文字顏色
  noStroke(); // 取消框線
  textSize(min(width * 0.06, 36)); // 設定結算標題字體大小
  textAlign(CENTER, CENTER); // 文字置中對齊
  text("測驗結束！", width / 2, height / 2 - 80); // 顯示結束標題
  
  textSize(min(width * 0.045, 26)); // 設定分數文字大小
  text(`您總共答對了：${score} / ${questions.length} 題`, width / 2, height / 2 - 20); // 顯示總答對題數
  
  // 根據答對題數顯示對應的鼓勵評語
  textSize(min(width * 0.035, 20));
  let feedback = "";
  if (score === 5) {
    feedback = "太強了！你對 p5.js 已經非常熟悉！";
  } else if (score >= 3) {
    feedback = "表現不錯！再多練習一下就更完美囉！";
  } else {
    feedback = "加油！多複習一下 p5.js 的基本指令吧！";
  }
  fill(100);
  text(feedback, width / 2, height / 2 + 40); // 顯示評語
}

// 設定「下一題」按鈕位置與大小的輔助函式
function positionNextButton() {
  nextButton.position(width / 2 - 60, height * 0.85); // 將按鈕置於畫布下方中央
  nextButton.size(120, 45); // 設定按鈕寬與高
}

// 滑鼠點擊事件：用於偵測使用者點選哪一個選項
function mousePressed() {
  // 若已經作答完畢或已經進入結算畫面，則不重複偵測點擊
  if (isAnswered || currentQuestion >= questions.length) return;
  
  let q = questions[currentQuestion];
  let uiWidth = min(width * 0.85, 650);
  let qBoxY = height * 0.22;
  let qBoxHeight = max(70, height * 0.12);
  let startY = qBoxY + qBoxHeight / 2 + 30;
  let boxHeight = max(45, height * 0.07);
  let spacing = 15;
  
  // 迴圈檢查點擊位置是否落在 4 個選項的範圍內
  for (let i = 0; i < q.options.length; i++) {
    let boxY = startY + i * (boxHeight + spacing);
    
    if (mouseX > width / 2 - uiWidth / 2 && 
        mouseX < width / 2 + uiWidth / 2 && 
        mouseY > boxY && mouseY < boxY + boxHeight) {
      
      selectedOption = i; // 記錄使用者選擇的選項索引
      isAnswered = true;  // 標記本題已完成作答
      
      // 檢查是否答對
      if (selectedOption === q.answer) {
        score++; // 答對題數加 1
      }
      
      // 如果是最後一題，將按鈕文字改為「看結果」；否則顯示「下一題」
      if (currentQuestion === questions.length - 1) {
        nextButton.html('看結果');
      } else {
        nextButton.html('下一題');
      }
      nextButton.show(); // 顯示切換按鈕
    }
  }
}

// 切換至下一題的函式
function nextQuestion() {
  currentQuestion++;       // 題目索引加 1
  selectedOption = null;   // 重設選取狀態
  isAnswered = false;      // 重設作答狀態
  nextButton.hide();       // 隱藏按鈕，進入下一題作答
}

// 當瀏覽器視窗大小改變時自動調整畫布與按鈕位置（響應式）
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 重新設定畫布寬高
  positionNextButton(); // 重新定位按鈕
}