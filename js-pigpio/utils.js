

exports.reverse_string = function (str) {
    var result='';
    var i = str.length-1;
    while (i>0) {
        if (str.substr(i-1, 2)!=='00' && str.substr(i-1, 2)!=='11') {
            result +=str [i-1] +  str[i] ;
        }
        i -=2;
    }
    return result;
};