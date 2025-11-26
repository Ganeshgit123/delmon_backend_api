import ejs  = require ('ejs')

class ejsController {

static generateRender = async (data: any, htmlFilePath: any) => {
    // console.log(data)
    try {
        return new Promise(async (resolve) => {
            ejs.renderFile(htmlFilePath, data, function(err, data) {
                console.log(err,'****')
                console.log(data,'data');
                
                resolve(data)
             })
        })
    } catch(err){
        console.log(err, 'err')
        return
    }
    

 }

}

export default ejsController;