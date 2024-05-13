// ファイター名と画像ファイル名のマッピング
let nameToImage = {
    "プロレスラー": "prowrestler",
    "柔道家": "judoka",
    "ボクサー": "boxer",
    "総合格闘家": "mmaFighter",
    "空手家": "karateka",
    "フードファイター": "foodFighter",
};

// ファイター名と画像ファイル名、パラメータのマッピング
let fighterData = {
    "プロレスラー": { image: "prowrestler", hp: 10, punch: 3, kick: 3, throw: 7, punchDef: 4, kickDef: 4, defense: 10, stomach: 7 },
    "柔道家": { image: "judoka", hp: 10, punch: 2, kick: 5, throw: 10, punchDef: 3, kickDef: 3, defense: 9, stomach: 6 },
    "ボクサー": { image: "boxer", hp: 10, punch: 10, kick: 2, throw: 2, punchDef: 9, kickDef: 1, defense: 3, stomach: 1 },
    "総合格闘家": { image: "mmaFighter", hp: 10, punch: 8, kick: 8, throw: 6, punchDef: 7, kickDef: 7, defense: 5, stomach: 2 },
    "空手家": { image: "karateka", hp: 10, punch: 7, kick: 9, throw: 1, punchDef: 6, kickDef: 8, defense: 2, stomach: 3 },
    "フードファイター": { image: "foodFighter", hp: 10, punch: 1, kick: 1, throw: 1, punchDef: 2, kickDef: 2, defense: 1, stomach: 10 }
};

// グローバル変数のユーザーとコンピューターのカードカウントを定義
let userCardCount = 0;
let computerCardCount = 0;

$(function () {

    // ファイターのリストの要素をfighterListItemsに格納
    let fighterListItems = $('#fighterList li');

    // ファイターの画像ファイルをfighterImageに格納
    let fighterImage = $('#fighterImage');

    // 現在選択しているファイターのインデックスを初期化（初期はプロレスラー）
    let currentIndex = 0;

    // ファイターを選択した後の処理（selectedクラスを付与する）の関数
    function updateSelection() {
        fighterListItems.removeClass('selected');
        let selectedItem = fighterListItems.eq(currentIndex).addClass('selected');
        let fighter = fighterData[selectedItem.text().trim()];
        fighterImage.css('background-image', 'url("./images/' + fighter.image + '.png")');
        $('#fighterName').text(selectedItem.text());
        $('#fighterHP').text(fighter.hp);
        $('#fighterPunch').text(fighter.punch);
        $('#fighterKick').text(fighter.kick);
        $('#fighterThrow').text(fighter.throw);
        $('#fighterPunchDef').text(fighter.punchDef);
        $('#fighterKickDef').text(fighter.kickDef);
        $('#fighterDefense').text(fighter.defense);
        $('#fighterStomach').text(fighter.stomach);
    }
    updateSelection();

    // キーボードの上下キーでカードを選択するときの処理の関数
    $(document).keydown(function (event) {
        if (event.key === 'ArrowUp' && currentIndex > 0) {
            currentIndex--;
        } else if (event.key === 'ArrowDown' && currentIndex < fighterListItems.length - 1) {
            currentIndex++;
        }
        updateSelection();
    });

    // マウスクリックでカードを選択するときの処理の関数
    fighterListItems.click(function () {
        currentIndex = $(this).index();
        updateSelection();
    });

    // 「このカードを選ぶ」ボタンをクリックした時の処理の関数
    $('#confirmSelection').click(function () {
        let selectedName = $('.selected').text().trim();
        if (!$('.selected').hasClass('unavailable')) {
            moveCardToTable(selectedName, '#yourTable');
            $('.selected').addClass('unavailable').removeClass('selected');
            userCardCount++;
            handleCardSelection();  // カード選択後の処理関数を呼ぶ
        }
    });

    // ユーザーまたはコンピュータがカードを決定する都度呼ばれる関数
    function handleCardSelection() {
        if (userCardCount + computerCardCount === 6) {  // ６枚全てのカードが選ばれたか
            $('#startBattle').show();  // 「バトル開始！」ボタンを表示
        } else if (userCardCount + computerCardCount < 6) {
            if (userCardCount > computerCardCount) {
                setTimeout(computerSelectsCard, 1500);  // 1.5秒後にコンピュータがカードを選ぶ
            } else if (userCardCount == computerCardCount) {
                // ユーザーとコンピュータの選択済みカード数が等しければユーザーのカード選択を待つ
            }
        }
    }

    // 「このカードを選ぶ」ボタンで決定したカードをユーザーのテーブルに移動する関数
    function moveCardToTable(name, tableId) {
        let imageName = nameToImage[name];
        let cardImageHtml = `<img src="./images/${imageName}.png" class="fighterCard" data-name="${name}">`;
        $(tableId).append(cardImageHtml);
    }

    // コンピュータがカードを選び、コンピュータのテーブルまで移動する関数
    function computerSelectsCard() {
        let availableCards = $('#fighterList li').not('.unavailable');
        if (availableCards.length > 0 && computerCardCount < 3) {
            let randomIndex = Math.floor(Math.random() * availableCards.length);
            let selectedCard = availableCards.eq(randomIndex);
            let selectedName = selectedCard.text().trim();
            moveCardToTable(selectedName, '#computerTable');
            selectedCard.addClass('unavailable');
            computerCardCount++;
            handleCardSelection();  // カード選択後の処理関数を呼ぶ
        }
    }

    // 現在のファイターのインデックス変数を定義
    let currentFighterIndex = 0;

    // ユーザーのバトルアクションを格納するための変数を定義
    let lastUserAction = "";

    // バトル開始ボタンのクリックイベント
    $('#startBattle').on('click', () => {
        highlightFighter();
        showBattleActions();
        $('#startBattle').hide();
    });

    // 現在戦っているファイターを黄色でハイライトする関数
    function highlightFighter() {
        // 全ファイターカードから既存のアクティブクラスを削除
        $('.fighterCard').removeClass('active-fighter');

        // 現在のユーザーとコンピュータのファイターを黄色でハイライトする
        $('#yourTable .fighterCard').eq(currentFighterIndex).addClass('active-fighter');
        $('#computerTable .fighterCard').eq(currentFighterIndex).addClass('active-fighter');
    }

    // バトルボタンを表示する関数
    function showBattleActions() {
        $('#battleActions').css('display', 'block');
        $('#attackPunch, #attackKick, #attackThrow, #attackEat').css('display', 'inline-block');
    }

    // 無限小数を切り上げて処理する関数
    function roundUp(value) {
        return Math.ceil(value * 10) / 10;
    }

    // 「大食い」のバトル結果を計算する関数
    function calculateFoodBattle(fighterStomach, opponentStomach) {
        // 補正値（0.8〜2.0）をランダムに生成
        let multiplier = roundUp(Math.random() * (2.0 - 0.8) + 0.8);

        // 戦闘結果を算出
        return roundUp((fighterStomach * multiplier) - opponentStomach);
    }

    // バトル結果を計算する関数
    function calculateBattle(userAttack, userDefense, computerAttack, computerDefense) {
        // 補正値（0.8〜1.4）をランダムに生成
        let userMultiplier = roundUp(Math.random() * (1.4 - 0.8) + 0.8);
        let computerMultiplier = roundUp(Math.random() * (1.4 - 0.8) + 0.8);

        // 「大食い」アクションの場合の処理
        if (lastUserAction === '大食い') {
            let userStomach = getAttackParameter('フードファイター', '大食い');
            let computerStomach = getDefenseParameter('フードファイター', '大食い');
            return {
                userResult: calculateFoodBattle(userStomach, computerStomach),
                computerResult: calculateFoodBattle(computerStomach, userStomach)
            };
        }

        // 通常の攻撃結果を計算
        let userResult = roundUp((userAttack * userMultiplier) - computerDefense);
        let computerResult = roundUp((computerAttack * computerMultiplier) - userDefense);

        return { userResult, computerResult };
    }

    // ユーザーのバトルボタンクリック時のイベントリスナー
    $('#attackPunch').on('click', () => handleUserAction('パンチ'));
    $('#attackKick').on('click', () => handleUserAction('キック'));
    $('#attackThrow').on('click', () => handleUserAction('投げる'));
    $('#attackEat').on('click', () => handleUserAction('大食い'));


    // ユーザーのアクション処理の関数
    function handleUserAction(action) {
        lastUserAction = action;
        let currentUserFighter = document.querySelectorAll('#yourTable .fighterCard')[currentFighterIndex];
        let userFighterName = currentUserFighter.dataset.name;

        alert(`${userFighterName}の${action}！`);

        // コンピュータのアクション処理
        handleComputerAction(userFighterName);
    }

    // コンピュータのアクション処理の関数
    function handleComputerAction(userFighterName) {
        let currentComputerFighter = document.querySelectorAll('#computerTable .fighterCard')[currentFighterIndex];
        let computerFighterName = currentComputerFighter.dataset.name;

        // コンピュータのファイターごとの攻撃
        let actions = [];
        switch (computerFighterName) {
            case 'ボクサー':
                actions = ['パンチ'];
                break;
            case '柔道家':
                actions = ['投げる'];
                break;
            case '空手家':
                actions = ['パンチ', 'キック'];
                break;
            case 'フードファイター':
                actions = ['大食い'];
                break;
            default:
                actions = ['パンチ', 'キック', '投げる'];
                break;
        }

        // コンピュータのアクションをランダムに選択し、アラートを表示
        let randomAction = actions[Math.floor(Math.random() * actions.length)];
        alert(`${computerFighterName}の${randomAction}！`);

        // 攻撃と防御のパラメータを取得
        let userAttack = getAttackParameter(userFighterName, lastUserAction);
        let userDefense = getDefenseParameter(userFighterName, randomAction);
        let computerAttack = getAttackParameter(computerFighterName, randomAction);
        let computerDefense = getDefenseParameter(computerFighterName, lastUserAction);

        // バトル結果を計算
        let { userResult, computerResult } = calculateBattle(userAttack, userDefense, computerAttack, computerDefense);

        // バトル結果アラートを表示
        determineBattleResult(userResult, computerResult);
    }

    // パラメータ取得用の関数
    function getAttackParameter(fighterName, action) {
        let parameter = 0;
        let data = fighterData[fighterName];

        switch (action) {
            case 'パンチ':
                parameter = data.punch;
                break;
            case 'キック':
                parameter = data.kick;
                break;
            case '投げる':
                parameter = data.throw;
                break;
            case '大食い':
                parameter = data.stomach;
                break;
            default:
                parameter = 0;
        }

        return parameter;
    }

    function getDefenseParameter(fighterName, action) {
        let parameter = 0;
        let data = fighterData[fighterName];

        switch (action) {
            case 'パンチ':
                parameter = data.punchDef;
                break;
            case 'キック':
                parameter = data.kickDef;
                break;
            case '投げる':
                parameter = data.defense;
                break;
            case '大食い':
                parameter = data.stomach;
                break;
            default:
                parameter = 0;
        }

        return parameter;
    }

    // バトル結果の判定
    function determineBattleResult(userResult, computerResult) {
        if (userResult > computerResult) {
            alert('ユーザーの勝ち！');
            highlightWinner('#yourTable', true);
            highlightWinner('#computerTable', false);
        } else if (computerResult > userResult) {
            alert('コンピューターの勝ち！');
            highlightWinner('#yourTable', false);
            highlightWinner('#computerTable', true);
        } else {
            alert('引き分け！');
        }

        // 次のファイターに進む
        currentFighterIndex++;
        if (currentFighterIndex < 3) {
            highlightFighter();
        } else {
            alert('全てのバトルが終了しました！');
            // 全バトル終了後にアクションボタンを非表示にする
            document.getElementById('battleActions').style.display = 'none';
        }
    }

    // 勝者カードを白枠、敗者カードを黒枠にする関数
    function highlightWinner(tableSelector, isWinner) {
        let fighterCards = document.querySelectorAll(`${tableSelector} .fighterCard`);
        if (fighterCards[currentFighterIndex]) {
            let card = fighterCards[currentFighterIndex];
            if (isWinner) {
                card.classList.add('winner');
                card.classList.remove('loser');
            } else {
                card.classList.add('loser');
                card.classList.remove('winner');
            }
        }
    }

});