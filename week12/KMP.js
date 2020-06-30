// KMP就是利用pattern本身的重复子串，在匹配失败时不用从头开始来提高效率
function find(source, pattern){
    // table用来记录每次与pattern失配后pattern指针回溯的位置
    let table = new Array(pattern.length).fill(0);
    let k = 0;
    for(let j = 1; j < pattern.length; j++){
        if(pattern[j] === pattern[k]){
            k++;
        }else{
            // k=0;
            while(k > 0 && pattern[k] !== pattern[j]){
                k = table[k-1];
            }
            if(pattern[k] === pattern[j]){
                k++;
            }else{
                k=0;
            }
        }
        table[j] = k;
    }
    // console.log(table)
    let j = 0;
    for(let i = 0; i < source.length; i++){
        let matched = true;
        if(source[i] === pattern[j]){
            j++;
        }else{
            while(source[i] !== pattern[j] && j > 0){
                j = table[j-1];
            }
            if(source[i] === pattern[j]){
                j++
            }else{
                j = 0;
            }
        }
        if(j === pattern.length){
            return true;
        }
    }
    return false;
}