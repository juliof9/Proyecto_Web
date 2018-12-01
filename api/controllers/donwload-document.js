module.exports = {


  friendlyName: 'Donwload document',


  description: 'GET elements',


  inputs: {

    id: {
      description: 'The id of the item whose photo we\'re downloading.',
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {
      outputDescription: 'The streaming bytes of the specified thing\'s photo.',
      outputType: 'ref'
    },

    forbidden: { responseType: 'forbidden' },

    notFound: { responseType: 'notFound' }
  },


  fn: async function ({id}) {

    var thing = await Documents.findOne({id});
    if (!thing) { throw 'notFound'; }

    // Check permissions.
    // (So people can't see images of stuff that isn't from their friends or themselves.)
    // var itemBelongsToFriend = _.any(this.req.me.friends, {id: thing.owner});
    var listaid = await Documents.find().populate('sharing');

    if (thing.owner !== this.req.me.id || !listaid.include(this.req.me.id)) {
      throw 'forbidden';
    }
    console.log("llegamos a la descarga");
    this.res.type(thing.imageUploadMime);


    var downloading = await sails.startDownload(thing.imageUploadFd);

    return downloading;

  }


};
