module.exports = {


  friendlyName: 'Upload documents',


  description: '',

  files: ['photo'],

  inputs: {
    photo: {
      description: 'Upstream for an incoming file upload.',
      type: 'ref'
    },

    label: {
      type: 'string',
      description: 'A (very) brief description of the item.'
    },


  },


  exits: {
    success: {
      outputDescription: 'The newly created `Thing`.',
      outputExample: {}
    },

    noFileAttached: {
      description: 'No file was attached.',
      responseType: 'badRequest'
    },

    tooBig: {
      description: 'The file is too big.',
      responseType: 'badRequest'
    },

  },


  fn: async function ({photo, label}, exits) {
    var url = require('url');
    var util = require('util');
    var info = await sails.uploadOne(photo)
    .intercept('E_EXCEEDS_UPLOAD_LIMIT', 'tooBig')
    .intercept((err)=>new Error('The photo upload failed: '+util.inspect(err)));
    if(!info){
      // Console.log("no hay info");
      throw 'badRequest';
    }
    console.log(info.type);
    var ext = info.type.split("/")[0] == 'image' ? info.fd : '/assets/images/' + info.type.split("/")[1];
    var ti = info.type.split("/")[0] ;
    // var imageSrc = url.resolve(sails.config.custom.baseUrl, '/api/v1/things/'+newThing.id+'/photo');
    var item = await Documents.create({
      label: label,
      extensionIMG: ext,
      dir: info.fd,
      owner: this.req.me.id,
      tipo: ti
    }).fetch();
    var auxid = item.id;
    var imageSrc = url.resolve(sails.config.custom.baseUrl, '/api/v1/documents/'+item.id+'/photo');
    console.log(imageSrc);
    await Documents.update({id: auxid}).set({basseurl: imageSrc}).fetch();
    // All done.
    return exits.success({item});

  }


};
