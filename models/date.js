function getDate(){
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDay();
    month = month < 10 ? '0'+ month : month ;
    day = day < 10 ? '0' + day : day ;
    return year + '/' + month + '/' + day;
}

module.exports = getDate;