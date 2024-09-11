const breakLength = document.getElementById("break-length");
const breakDecrement = document.getElementById("break-decrement");
const breakIncrement = document.getElementById("break-increment");
const sessionLength = document.getElementById("session-length");
const sessionDecrement = document.getElementById("session-decrement");
const sessionIncrement = document.getElementById("session-increment");
const timeLeft = document.getElementById("time-left");
const startStop = document.getElementById("start_stop");
const reset = document.getElementById("reset");
const timerLabel = document.getElementById("timer-label");
const beep = document.getElementById("beep");

let timer;
let timerStatus = "begin";
let sessionOrBreak = "session";
let timeDisplay;
let minuteDisplay;
let secondDisplay;

// 数字を2桁表示にフォーマットする関数
const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
};

// タイマーの時間を mm:ss 形式でセットする関数
const setTimeLeft = (minutes, seconds = 0) => {
    timeLeft.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
};

// タイマースタート/ストップイベント
startStop.addEventListener('click', () => {
    if (timerStatus === "begin" || timerStatus === "stopped") {
        startTimer();
    } else if (timerStatus === "counting") {
        stopTimer();
    }
});

const startTimer = () => {
    timerStatus = "counting";
    timer = setInterval(() => {
        timeLeft.textContent = decrementTime(timeLeft.textContent);
    }, 1000);
};

const stopTimer = () => {
    timerStatus = "stopped";
    clearInterval(timer);
};

// タイムデクリメント関数
const decrementTime = (timeString) => {
    timeDisplay = timeString.split(":");
    minuteDisplay = parseInt(timeDisplay[0]);
    secondDisplay = parseInt(timeDisplay[1]);

    // タイマーが00:00に到達した場合
    if (minuteDisplay === 0 && secondDisplay === 0) {
    // タイマーが 00:00 に達した場合
    beep.play();  // ビープ音を鳴らす
    
    clearInterval(timer);  // タイマーをクリアする（ここでタイマーを停止）
    
    // セッションまたはブレイクタイムを切り替える
    if (sessionOrBreak === "session") {
        sessionOrBreak = "break";
        timerLabel.textContent = "Break";  // ラベルを "Break" に変更
        minuteDisplay = parseInt(breakLength.textContent);  // ブレイク時間をセット
    } else {
        sessionOrBreak = "session";
        timerLabel.textContent = "Session";  // ラベルを "Session" に変更
        minuteDisplay = parseInt(sessionLength.textContent);  // セッション時間をセット
    }

    secondDisplay = 0;  // 秒数をリセット
    
        setTimeLeft(minuteDisplay, secondDisplay);  // タイマー表示を更新
        startTimer();  // 次のタイマーを開始

    // タイマーを更新して表示
    return `${formatTime(minuteDisplay)}:00`;
}


    // 通常のデクリメント処理
    secondDisplay -= 1;

    if (secondDisplay === -1) {
        secondDisplay = 2; // 秒のリセット
        minuteDisplay = 0; // 分のデクリメント
    }

    return `${formatTime(minuteDisplay)}:${formatTime(secondDisplay)}`;
};

// ブレイク時間のデクリメント
breakDecrement.addEventListener('click', () => {
    if (parseInt(breakLength.textContent) > 1 && timerStatus !== "counting") {
        breakLength.textContent = parseInt(breakLength.textContent) - 1;
    }
});

// ブレイク時間のインクリメント
breakIncrement.addEventListener('click', () => {
    if (parseInt(breakLength.textContent) < 60 && timerStatus !== "counting") {
        breakLength.textContent = parseInt(breakLength.textContent) + 1;
    }
});

// セッション時間のデクリメント
sessionDecrement.addEventListener('click', () => {
    if (parseInt(sessionLength.textContent) > 1 && timerStatus !== "counting") {
        sessionLength.textContent = parseInt(sessionLength.textContent) - 1;
        setTimeLeft(parseInt(sessionLength.textContent)); // タイマーの表示も更新
    }
});

// セッション時間のインクリメント
sessionIncrement.addEventListener('click', () => {
    if (parseInt(sessionLength.textContent) < 60 && timerStatus !== "counting") {
        sessionLength.textContent = parseInt(sessionLength.textContent) + 1;
        setTimeLeft(parseInt(sessionLength.textContent)); // タイマーの表示も更新
    }
});

// リセットボタンの処理
reset.addEventListener('click', () => {
    clearInterval(timer);
    beep.pause();
    beep.currentTime = 0;
    breakLength.textContent = 5;
    sessionLength.textContent = 25;
    setTimeLeft(25); // リセット後の時間を mm:ss 形式でセット
    timerLabel.textContent = "Session";
    timerStatus = "begin";
    sessionOrBreak = "session";
});
