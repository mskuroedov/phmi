function generateNabor() {
    var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var i;
    var string = '';
    var length = Math.floor((Math.random() * 9) + 1);
    var count = 0;
    console.log(length);
    while (count !== length) {
        i = Math.floor((Math.random() * nums.length));
        string = string + nums[i];
        nums.splice(i, 1);
        count++;
    }
    return string
}

function transtaleRim(arr) {
    var string = '';
    for (var i = 0; i < arr.length; i++) {
        switch (arr[i]) {
            case '0':
                string += '0-';
                break;
            case '1':
                string += 'I-';
                break;
            case '2':
                string += 'II-';
                break;
            case '3':
                string += 'III-';
                break;
            case '4':
                string += 'IV-';
                break;
            case '5':
                string += 'V-';
                break;
            case '6':
                string += 'VI-';
                break;
            case '7':
                string += 'VII-';
                break;
            case '8':
                string += 'VIII-';
                break;
            case '9':
                string += 'IX-';
                break;

        }
    }

    return string.substring(0, string.length - 1);
}

function transtalePict(arr) {
    var string = '';
    for (var i = 0; i < arr.length; i++) {
        switch (arr[i]) {
            case '0':
                string += '<span class="pict">0</span>  ';
                break;
            case '1':
                string += '<span class="pict">1</span>  ';
                break;
            case '2':
                string += '<span class="pict">2</span>  ';
                break;
            case '3':
                string += '<span class="pict">3</span>  ';
                break;
            case '4':
                string += '<span class="pict">4</span>  ';
                break;
            case '5':
                string += '<span class="pict">5</span>  ';
                break;
            case '6':
                string += '<span class="pict">6</span>  ';
                break;
            case '7':
                string += '<span class="pict">7</span>  ';
                break;
            case '8':
                string += '<span class="pict">8</span>  ';
                break;
            case '9':
                string += '<span class="pict">9</span>  ';
                break;

        }
    }

    return string.substring(0, string.length - 1);
}

function generateText(i) {
    var string;
    switch (i) {
        case 0:
            string = transtaleRim(questions[i]);
            break;
        case 1:
            string = transtaleRim(questions[i]).replace(/-/g, '<br>');
            break;
        case 2:
            string = '<p class="font-weight-bigger"> ';
            string += transtaleRim(questions[i]) + '</p>';
            break;
        case 3:
            string = '<p class="font-weight-smaller"> ';
            string += transtaleRim(questions[i]) + '</p>';
            break;
        case 4:
            string = transtalePict(questions[i]);
            break;
        case 5:
            string = transtalePict(questions[i]).replace(/  /g, '<br>');
            break;
        case 6:
            string = '<p class="font-weight-bigger"> ';
            string += transtalePict(questions[i]) + '</p>';
            break;
        case 7:
            string = '<p class="font-weight-smaller"> ';
            string += transtalePict(questions[i]) + '</p>';
            break;
        default:
            break
    }

    return string;
}

function generateQuestion(i) {
    var number = questions[i];
    console.log(number);
    console.log(generateText(i));
    $('#question-num').text(i + 1);
    $('#question-text').html(generateText(i));
    $('#timer').text('6 сек');
    $('#question').show();
    var time = 6;
    $('.progress-bar').css('width', '0%');
    var interval = setInterval(function () {

        if (time === 0) {
            clearInterval(interval);
            goAnswer(i + 1);
        }
        $('#timer').text(time + ' сек');
        $('.progress-bar').css('width', 100 - time * 16 + '%');
        time--;
    }, 1000);

}

function goAnswer(i) {
    $('#question').hide();
    $('#answer').show();
    $('#answer-input').focus();
    $('#answer-complete').off('click').on('click', function () {
        if ($('#answer-input').val() !== '') {
            if (i >= questions.length) {
                finishTest();
            } else {
                generateQuestion(i);
                answers.push($('#answer-input').val());
                $('#answer-input').val('');
                $('#answer').hide();
            }
            console.log(answers);
        }
    });
}

var questions;
var answers;
var username;

function startTest() {
    username = $('#user-name').val();
    questions = [];
    answers = [];
    for (var i = 0; i < 8; i++) {
        questions.push(generateNabor());
    }
    console.log(questions);

    $('#hello').hide();
    $('#test').show();

    generateQuestion(0);
}

function finishTest() {
    answers.push($('#answer-input').val());
    $('#answer-input').val('');
    $('#answer').hide();
    var gAnswers = 0;
    for (var i = 0; i < questions.length; i++) {
        if (questions[i] === answers[i]) {
            gAnswers++;
            var block = $('#results-template').clone().removeAttr('id').addClass('alert-success d-block');
            block.find('[key=i]').text(i + 1);
            block.find('[key=question]').text(questions[i]);
            block.find('[key=answer]').text(answers[i]);
            $('#results-row').append(block);

        } else {
            var block = $('#results-template').clone().removeAttr('id').addClass('alert-danger d-block');
            block.find('[key=i]').text(i + 1);
            block.find('[key=question]').text(questions[i]);
            block.find('[key=answer]').text(answers[i]);
            $('#results-row').append(block);
        }
    }

    $('#right-answers').text(gAnswers);
    $('[key=username]').text(username);

    $('#finished-test').show();

    $.ajax({
        type: 'POST',
        url: "/results",
        headers: {"X-CSRFToken": csrf_token},
        data: {
            answers: answers,
            questions: questions,
            username: username
        },
        success: function (data, textStatus, xhr) {
            console.log(data);
        },
        error: function (data, textStatus, xhr) {
            console.log('error', data);
        }
    });
}