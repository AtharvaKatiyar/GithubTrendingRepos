function getStartDateFromDuration(duration){
    const now = new Date();
    const startDate = new Date(now);

    switch(duration){
        case 'day': startDate.setDate(now.getDate()-1);
                    break;
        case 'week': startDate.setDate(now.getDate() - 7);
                      break;
        case 'month': startDate.setDate(now.getDate()-30);
                      break;
        case 'year': startDate.setDate(now.getDate() - 365);
                     break;
        default: throw new Error(`Unsupported duration: ${duration}`);
    }
    return startDate.toISOString().split("T")[0];
}

export {getStartDateFromDuration};