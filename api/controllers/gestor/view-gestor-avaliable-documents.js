module.exports = {


  friendlyName: 'View gestor avaliable documents',


  description: 'Display "Gestor avaliable documents" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/gestor/gestor-avaliable-documents'
    }

  },


  fn: async function () {

    // Respond with view.
    var url = require('url');


    var documents = await Documents.find({ owner: this.req.me.id});
    var documentsshared = await Documents.find().populate('sharing',{
      where: {
        id: this.req.me.id
      }
    });

    _.each(documents, (doc)=>{
      if(doc.tipo == 'image'){
      // doc.baseurl = url.resolve(sails.config.custom.baseUrl,'/api/v1/documents/'+doc.id);
      doc.baseurl =' https://image.freepik.com/free-icon/text-document_318-48568.jpg';
      }else{
        doc.baseurl = 'https://image.freepik.com/free-icon/text-document_318-48568.jpg';
      }
    });
    _.each(documentsshared, (doc)=>{
      doc.baseurl = '/api/v1/documents/:id';
      
    });

    if(!documents){
      if(!documentsshared){

        return;
      }

      return{
        documentsshared
      };
    }
    return{
      documents,
      documentsshared
    };

  }


};
