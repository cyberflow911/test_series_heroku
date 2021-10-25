const Joi = require('joi');

module.exports = (checks, data) => {

    let check = { };
    let checkList = {
        accountNumber: Joi.string().min(10).max(12).required(),
        ifsc : Joi.string().min(11).max(11).required(), 
        accountHolder: Joi.string().min(3).required(),
        bankName: Joi.string().min(3).required(),
        amount: Joi.number()     
        
        
        
        
    }

    checks.split(' ').forEach(key => {
        let trimmedKey = key.trim();

        if(trimmedKey && checkList[trimmedKey]) {
            check[`${trimmedKey}`] = checkList[`${trimmedKey}`];
        }
    });

    const schema = Joi.object(check);

    const { error } = schema.validate(data);

    if (error) {
        return false;
}
    return true;
}
