$('#start-test').on('click',function () {
    if($('#user-name').val() !== ''){
        startTest();
    }
});
$('#answer-input').on('keyup',function (e) {
    e.preventDefault();
    if (e.keyCode === 13) {
        $('#answer-complete').click();
    }
});
$('#user-name').on('keyup',function (e) {
    e.preventDefault();
    if (e.keyCode === 13) {
        $('#start-test').click();
    }
});