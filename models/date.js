function getDate(){
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    month = month < 10 ? '0'+ month : month ;
    day = day < 10 ? '0' + day : day ;
    return year + '/' + month + '/' + day;
}

module.exports = getDate;