

exports.reverse_string = function (str) {
    var result='';
    var i = str.length-1;
    //First two bytes indicate buffer size
    while (i>2) {
        if (str.substr(i-1, 2)!=='00') {
            result +=str [i-1] +  str[i] ;
        }
        i -=2;
    }
    return parseInt(result,'16');
};