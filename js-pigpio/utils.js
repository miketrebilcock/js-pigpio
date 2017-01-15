

exports.reverse_string = function (str) {
    var result='';
    var i = str.length-1;
    while (i>str.length-9) {
        if (str.substr(i-1, 2)!=='00') {
            result +=str [i-1] +  str[i] ;
        }
        i -=2;
    }
    return parseInt(result,'16');
};