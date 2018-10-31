export const getUnicodeSearchName = (keyword) => {
    var searchName = keyword;
    if(typeof searchName == 'string') {
        searchName = searchName.toLowerCase();
        searchName = searchName.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
        searchName = searchName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
        searchName = searchName.replace(/ì|í|ị|ỉ|ĩ/g,"i");
        searchName = searchName.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
        searchName = searchName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
        searchName = searchName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
        searchName = searchName.replace(/đ/g,"d");
        // searchName = searchName.replace(/!|@|\$|%|\^|\*|∣|\+|=|<|>|\?|\/|,|\.|:|'|"|&|#|\[|\]|~/g,"-");
        searchName = searchName.replace(/-+-/g,"-");  // replace -- by -
        searchName = searchName.replace(/^-+|-+$/g,""); // cut - at the begin&end of string
    }
    return searchName;
}